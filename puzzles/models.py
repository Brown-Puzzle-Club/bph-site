import collections
import datetime
import unicodedata
from urllib.parse import quote_plus
import math

from django import forms
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models import (
    F,
    FilteredRelation,
    Q,
    BooleanField,
    Value,
    Case,
    When,
    Count,
)
from django.db.models.functions import Coalesce
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.translation import gettext as _

import uuid
import random

from django.contrib.postgres.indexes import GinIndex
from puzzles.context import context_cache
from puzzles.signals import send_notification, create_minor_case_incoming_event
from puzzles.messaging import (
    dispatch_general_alert,
    dispatch_submission_alert,
    discord_interface,
)

from puzzles.hunt_config import (
    HUNT_END_TIME,
    HUNT_CLOSE_TIME,
    MAJOR_CASE_SLUGS,
    MAJOR_CASE_UNLOCK_SOLVE_COUNT,
    MAX_GUESSES_PER_PUZZLE,
    HINTS_ENABLED,
    HOURS_PER_HINT,
    HINT_TIME,
    TEAM_AGE_BEFORE_HINTS,
    INTRO_HINTS,
    FREE_ANSWERS_ENABLED,
    FREE_ANSWERS_PER_DAY,
    FREE_ANSWER_TIME,
    TEAM_AGE_BEFORE_FREE_ANSWERS,
)


class MajorCase(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    slug = models.SlugField(max_length=255, unique=True, verbose_name=_("Slug"))
    order = models.IntegerField(default=0, verbose_name=_("Order"))
    puzzle = models.ForeignKey(
        "Puzzle",
        limit_choices_to={"is_major_meta": True},
        on_delete=models.SET_NULL,
        verbose_name=_("puzzle"),
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = _("major case")
        verbose_name_plural = _("major cases")

    def __str__(self):
        return self.name


class Round(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Name"))
    slug = models.SlugField(max_length=255, unique=True, verbose_name=_("Slug"))
    meta = models.ForeignKey(
        "Puzzle",
        limit_choices_to={"is_meta": True},
        related_name="+",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name=_("meta"),
    )
    order = models.IntegerField(default=0, verbose_name=_("Order"))

    major_case = models.ForeignKey(
        MajorCase,
        on_delete=models.CASCADE,
        verbose_name=_("major case"),
        blank=True,
        null=True,
    )
    description = models.TextField(
        default="", blank=True, verbose_name=_("Description"), null=True
    )

    unlock_global_minor = models.IntegerField(
        default=-1,
        verbose_name=_("Unlock global minor"),
        help_text=_("If nonnegative, round unlocks after N solves in any major case."),
    )
    unlock_local_major = models.IntegerField(
        default=-1,
        verbose_name=_("Unlock local minor"),
        help_text=_("If nonnegative, round unlocks after N solves in this major case."),
    )
    unlock_hours = models.IntegerField(
        default=-1,
        verbose_name=_("Unlock hours"),
        help_text=_("If nonnegative, round unlocks N hours after the hunt starts."),
    )

    class Meta:
        verbose_name = _("round (minor case)")
        verbose_name_plural = _("rounds (minor cases)")

    def meta_answer(self):
        return self.meta.answer if self.meta else None

    @staticmethod
    def get_unlocked_rounds(context):
        if context.is_admin:
            return Round.objects.all()

        unlocked_round_dicts = context.team.unlocks_by_case.values()
        unlocked_rounds = {}
        for round_dict in unlocked_round_dicts:
            unlocked_rounds.update(round_dict)

        return Round.objects.filter(slug__in=unlocked_rounds.keys())

    def __str__(self):
        return self.name


class Puzzle(models.Model):
    """A single puzzle in the puzzlehunt."""

    name = models.CharField(max_length=255, verbose_name=_("Name"))

    # I considered making this default to django.utils.text.slugify(name) via
    # cleaning, but that's a bit more invasive because you need blank=True for
    # the admin page to let you submit blank strings, and there will be errors
    # if a blank slug sneaks past into your database (e.g. the puzzle page
    # can't be URL-reversed). Note that not all routes a model could enter the
    # database will call clean().
    slug = models.SlugField(
        max_length=255,
        unique=True,
        verbose_name=_("Slug"),
        help_text=_("Slug used in URLs to identify this puzzle (must be unique)"),
    )

    body = models.TextField(
        default="",
        blank=True,
        verbose_name=_("Puzzle Body"),
        null=True,
        help_text=_(
            "Markdown-compliant body of the puzzle. This is the main text that will be displayed to the user."
        ),
    )

    body_remote = models.TextField(
        default="",
        blank=True,
        verbose_name=_("Remote Puzzle Body"),
        null=True,
        help_text=_(
            "This is the main text that will be displayed to the user if they are a remote team. (if blank, all users will get regular body.) "
        ),
    )

    solution = models.TextField(
        default="",
        blank=True,
        verbose_name=_("Solution"),
        null=True,
        help_text=_("Markdown-compliant solution to the puzzle."),
    )

    clipboard = models.TextField(
        default="",
        blank=True,
        verbose_name=_("Clipboard"),
        null=True,
        help_text=_("Google-sheets compliant copy to clipboard for the puzzle"),
    )

    clipboard_remote = models.TextField(
        default="",
        blank=True,
        verbose_name=_("Remote Clipboard"),
        null=True,
        help_text=_(
            "Google-sheets compliant copy to clipboard for the puzzle for remote teams"
        ),
    )

    answer = models.CharField(
        max_length=255,
        verbose_name=_("Answer"),
        help_text=_("Answer (fine if unnormalized)"),
    )

    # round is only required if the puzzle is not a major meta
    round = models.ForeignKey(
        Round, null=True, blank=True, on_delete=models.CASCADE, verbose_name=_("round")
    )
    order = models.IntegerField(default=0, verbose_name=_("Order"))
    is_meta = models.BooleanField(default=False, verbose_name=_("Is meta"))
    is_major_meta = models.BooleanField(default=False, verbose_name=_("Is major meta"))

    # For unlocking purposes, a "main round solve" is a solve that is not a
    # meta or in the intro round.
    unlock_hours = models.IntegerField(
        default=-1,
        verbose_name=_("Unlock hours"),
        help_text=_("If nonnegative, puzzle unlocks N hours after the hunt starts."),
    )
    unlock_global = models.IntegerField(
        default=-1,
        verbose_name=_("Unlock global"),
        help_text=_(
            "If nonnegative, puzzle unlocks after N main round solves in any round."
        ),
    )
    unlock_local = models.IntegerField(
        default=-1,
        verbose_name=_("Unlock local"),
        help_text=_(
            "If nonnegative, puzzle unlocks after N main round solves in this round."
        ),
    )
    unlock_meta = models.IntegerField(
        default=-1,
        verbose_name=_("Unlock meta"),
        help_text=_("If nonnegative, puzzle unlocks after N meta solves."),
    )

    emoji = models.CharField(
        max_length=32,
        default=":question:",
        verbose_name=_("Emoji"),
        help_text=_("Emoji to use in Discord integrations involving this puzzle"),
    )

    class Meta:
        verbose_name = _("puzzle")
        verbose_name_plural = _("puzzles")

    def __str__(self):
        return self.name

    @property
    def short_name(self):
        ret = []
        last_alpha = False
        for c in self.name:
            if c.isalpha():
                if not last_alpha:
                    ret.append(c)
                if not last_alpha:
                    ret.append(c)
                last_alpha = True
            elif c != "'":
                if c != " ":
                    ret.append(c)
                last_alpha = False
        if len(ret) >= 7:
            return "".join(ret[:4]) + "..."
        else:
            return "".join(ret)

    @property
    def normalized_answer(self):
        return Puzzle.normalize_answer(self.answer)

    @staticmethod
    def normalize_answer(s):
        if s is None:
            return s
        nfkd_form = unicodedata.normalize("NFKD", s)
        return "".join([c.upper() for c in nfkd_form if c.isalpha()])


@context_cache
class Team(models.Model):
    """
    A team participating in the puzzlehunt.

    This model has a one-to-one relationship to Users -- every User created
    through the register flow will have a "Team" created for them.
    """

    # The associated User -- note that not all users necessarily have an
    # associated team.
    user = models.OneToOneField(User, on_delete=models.PROTECT)

    # Public team name for scoreboards and comms -- not necessarily the same as
    # the user's name from the User object
    team_name = models.CharField(
        max_length=420 + 3,
        unique=True,
        verbose_name=_("Team name"),
        help_text=_("Public team name for scoreboards and communications"),
    )

    # Time of creation of team
    creation_time = models.DateTimeField(
        auto_now_add=True, verbose_name=_("Creation time")
    )

    start_offset = models.DurationField(
        default=datetime.timedelta,
        verbose_name=_("Start offset"),
        help_text=_(
            """How much earlier this team should start, for early-testing
        teams; be careful with this!"""
        ),
    )
    allow_time_unlocks = models.BooleanField(
        default=True,
        verbose_name=_("Allow time unlocks"),
        help_text=_(
            """Whether this team receives time-unlocked puzzles. Note that
        if disabled, they may be able to access more puzzles by logging out"""
        ),
    )

    total_hints_awarded = models.IntegerField(
        default=0,
        verbose_name=_("Total hints awarded"),
        help_text=_(
            """Number of additional hints to award the team (on top of
        the default amount per day)"""
        ),
    )
    total_free_answers_awarded = models.IntegerField(
        default=0,
        verbose_name=_("Total free answers awarded"),
        help_text=_(
            """Number of additional free answers to award the team (on
        top of the default amount per day)"""
        ),
    )

    last_solve_time = models.DateTimeField(
        null=True, blank=True, verbose_name=_("Last solve time")
    )

    is_prerelease_testsolver = models.BooleanField(
        default=False,
        verbose_name=_("Is prerelease testsolver"),
        help_text=_(
            """Whether this team is a prerelease testsolver. If true, the
        team will have access to puzzles before the hunt starts"""
        ),
    )

    is_hidden = models.BooleanField(
        default=False,
        verbose_name=_("Is hidden"),
        help_text=_("If a team is hidden, it will not be visible to the public"),
    )

    # LOGISTICS DATA (BPH ADD)
    in_person = models.BooleanField(default=False, verbose_name=_("In person team?"))
    brown_team = models.BooleanField(
        default=False,
        verbose_name=_("Brown U Team?"),
        help_text=_("(Undergraduates, Graduates, Faculty, or Alumni)"),
    )
    num_brown_members = models.IntegerField(
        default=0,
        verbose_name=_("Number of Brown members"),
    )
    classroom_need = models.BooleanField(
        default=False,
        verbose_name=_("Classroom Request?"),
        help_text=_(
            "Our availability will be limited, so please do not request one if you can make alternate plans."
        ),
    )
    where_to_find = models.CharField(
        default=_("NO LOCATION"),
        max_length=200,
        verbose_name=_("Location during hunt"),
        help_text=_(
            "(e.g: Hegeman Common Room, Barus and Holley Room ###, Zoom, Discord, etc.)"
        ),
    )
    phone_number = models.CharField(
        default=_("-1"), max_length=200, verbose_name=_("Phone number")
    )

    # misc bph2024 adds:
    color_choice = models.CharField(
        default=_("#ffffff"), max_length=200, verbose_name=_("Color choice")
    )
    emoji_choice = models.CharField(
        default=_("❓"), max_length=200, verbose_name=_("Emoji choice")
    )

    # merge_out = models.BooleanField(verbose_name=_('Is the team interested in joining up with a larger team for the hunt.'), default=False)
    # merge_out_preferences = models.CharField(default="", max_length=200, verbose_name=_('Merge out with larger team preferences'), help_text=_('(e.g. size, age-range, in-person vs remote, etc.)'))
    # merge_in = models.BooleanField(verbose_name=_('Is the team interested in taking on lone-solvers.'), default=False)
    # merge_in_preferences = models.CharField(default="", max_length=200, verbose_name=_('Lone solver merge in preferences'), help_text=_('(e.g. size, age-range, in-person vs remote, etc.). DO NOT GIVE A TEAM MORE THAN THE NUMBER OF MEMBERS THEY ARE ASKING FOR!'))

    # def meta_solve_count(self):
    #     solve_cnt = 0
    #     for solve in self.solves:
    #         if solve.puzzle.is_meta:
    #           solve_cnt += 1
    #     return solve_cnt

    class Meta:
        verbose_name = _("team")
        verbose_name_plural = _("teams")

    def __str__(self):
        return self.team_name  # possibly return JSON of all safe fields?

    def get_emails(self, with_names=False):
        return [
            ((member.email, str(member)) if with_names else member.email)
            for member in self.teammember_set.all()
            if member.email
        ]

    def puzzle_submissions(self, puzzle):
        return [
            submission for submission in self.submissions if submission.puzzle == puzzle
        ]

    def puzzle_answer(self, puzzle):
        return puzzle.answer if puzzle.id in self.solves else None

    def guesses_remaining(self, puzzle):
        wrong_guesses = sum(
            1
            for submission in self.puzzle_submissions(puzzle)
            if not submission.is_correct
        )
        extra_guess_grant = ExtraGuessGrant.objects.filter(
            team=self, puzzle=puzzle
        ).first()  # will be model or None
        extra_guesses = extra_guess_grant.extra_guesses if extra_guess_grant else 0
        return MAX_GUESSES_PER_PUZZLE + extra_guesses - wrong_guesses

    @staticmethod
    def leaderboard(current_team, hide_hidden=True, hide_remote=False):
        """
        Returns a list of dictionaries with data of teams in the order they
        should appear on the leaderboard. Dictionaries have the following keys:
          - 'id'
          - 'user_id'
          - 'team_name'
          - 'in_person': if they are in person versus remote
          - 'total_solves': number of solves (before hunt end)
          - 'last_solve_or_creation_time': last non-free solve (before hunt
            end), or if none, team creation time
          - 'runaround_solve_time': time of finishing the runaround (if before hunt
            end and in-person)
          - 'all_metas_solve_time': time of finishing all the metas ()

        This depends on the viewing team for hidden teams.
        """

        return Team.leaderboard_teams(current_team, hide_hidden, hide_remote).values(
            "id",
            "user_id",
            "in_person",
            "team_name",
            "total_solves",
            "last_solve_or_creation_time",
            "runaround_solve_time",
            "recent_meta_solve_time",
            "all_metas_solve_time",
            "meta_solve_count",
        )

    @staticmethod
    def leaderboard_teams(current_team, hide_hidden=True, hide_remote=False):
        """
        Returns a (lazy, not-yet-evaluated) QuerySet of teams, in the order
        they should appear on the leaderboard, with the following annotations:
          - 'total_solves': number of solves (before hunt end)
          - 'last_solve_or_creation_time': last non-free solve (before hunt
            end), or if none, team creation time
          - 'runaround_solve_time': time of finishing the runaround (if before hunt
            end and in-person)
          - 'all_metas_solve_time': time of finishing all the metas ()

        This depends on the viewing team for hidden teams.
        """

        q = Q()
        # be careful, this is not "always true", I think it's "always true" if
        # &'d and "always false" if |'d

        if hide_hidden:
            # hide hidden teams (usually)
            q &= Q(is_hidden=False)
            if current_team:
                # ...but always show current team, regardless of hidden status
                q |= Q(id=current_team.id)

        if hide_remote:
            q &= Q(in_person_sat__gt=0) | Q(in_person_sun__gt=0)

        all_teams = Team.objects.filter(q, creation_time__lt=HUNT_END_TIME)

        # https://docs.djangoproject.com/en/3.1/ref/models/querysets/#filteredrelation-objects
        # FilteredRelation does a LEFT OUTER JOIN with additional conditions in
        # the ON clause, so every team survives; the other stuff aggregates it
        all_teams = all_teams.annotate(
            scoring_submissions=FilteredRelation(
                "answersubmission",
                condition=Q(
                    answersubmission__used_free_answer=False,
                    answersubmission__is_correct=True,
                    answersubmission__submitted_datetime__lt=HUNT_END_TIME,
                ),
            ),
            total_solves=Count("scoring_submissions"),
            # runaround_solve_time=Min(
            #     Case(
            #         When(
            #             scoring_submissions__puzzle__slug=RUNAROUND_SLUG,
            #             then="scoring_submissions__submitted_datetime",
            #         )
            #         # else, null by default
            #     )
            # ),
            # recent_meta_solve_time=Max(
            #     Case(  # only usable when all metas are solved.. So check meta_solve_count first.
            #         When(
            #             Q(scoring_submissions__puzzle__slug__in=META_SLUGS),
            #             then="scoring_submissions__submitted_datetime",
            #         ),
            #         default=None,
            #         output_field=models.DateTimeField(),
            #     )
            # ),
            # meta_solve_count=Count(
            #     Case(
            #         When(
            #             Q(scoring_submissions__puzzle__slug__in=META_SLUGS),
            #             then="scoring_submissions__submitted_datetime",
            #         ),
            #         default=None,
            #         output_field=IntegerField(),
            #     )
            # ),
            # all_metas_solve_time=Case(
            #     When(
            #         meta_solve_count=len(META_SLUGS),
            #         then=Max(
            #             Case(
            #                 When(
            #                     Q(scoring_submissions__puzzle__slug__in=META_SLUGS),
            #                     then="scoring_submissions__submitted_datetime",
            #                 ),
            #                 default=None,
            #                 output_field=models.DateTimeField(),
            #             )
            #         ),
            #     ),
            #     default=None,
            #     output_field=models.DateTimeField(),
            # ),
            # Coalesce(things) = the first of things that isn't null
            last_solve_or_creation_time=Coalesce("last_solve_time", "creation_time"),
            in_person=Case(
                When(Q(in_person_sat__gt=0) | Q(in_person_sun__gt=0), then=Value(True)),
                default=Value(False),
                output_field=BooleanField(),
            ),
        ).order_by(
            F("runaround_solve_time").asc(nulls_last=True),
            F("all_metas_solve_time").asc(nulls_last=True),
            F("meta_solve_count").desc(),
            F("total_solves").desc(),
            # F('in_person').desc(),
            F("last_solve_or_creation_time"),
        )

        return all_teams

        # Old joined-in-python implementation, with a different output format,
        # follows. I couldn't convince myself that pushing all the annotations
        # and sort into the database necessarily improved performance, but I
        # don't think it got significantly worse either, and the above version
        # feels like it enables future optimizations more effectively; for
        # example, I think the fact that computing the ranking on the team page
        # only needs values_list('id', flat=True) is pretty good. (On the
        # other hand, there are hunt formats where completing the sort in the
        # database is very difficult or even impossible due to a more
        # complicated scoring/ranking algorithm or one that uses information
        # not available in the database, like GPH 2018...)

        # total_solves = collections.defaultdict(int)
        # meta_times = {}
        # for team_id, slug, time in AnswerSubmission.objects.filter(
        #     used_free_answer=False, is_correct=True, submitted_datetime__lt=HUNT_END_TIME
        # ).values_list('team__id', 'puzzle__slug', 'submitted_datetime'):
        #     total_solves[team_id] += 1
        #     if slug == RUNAROUND_SLUG:
        #         meta_times[team_id] = time

        # return sorted(
        #     [{
        #         'team_name': team.team_name,
        #         'is_current': team == current_team,
        #         'total_solves': total_solves[team.id],
        #         'last_solve_time': team.last_solve_time or team.creation_time,
        #         'metameta_solve_time': meta_times.get(team.id),
        #         'team': team,
        #     } for team in all_teams],
        #     key=lambda d: (
        #         d['metameta_solve_time'] or HUNT_END_TIME,
        #         -d['total_solves'],
        #         d['last_solve_time'],
        #     )
        # )

    def team(self):
        return self

    def asked_hints(self):
        return tuple(self.hint_set.select_related("puzzle", "puzzle__round"))

    def num_hints_total(self):
        """
        Compute the total number of hints (used + remaining) available to this team.
        """
        FREE_HINT_CNT = 2
        if not HINTS_ENABLED or self.hunt_is_over:
            return 0
        if self.now < self.creation_time + TEAM_AGE_BEFORE_HINTS:
            return self.total_hints_awarded
        # print("f")
        # print(self.now)
        # print(self.start_offset)
        # print(HINT_TIME)
        # print(HINT_TIME - self.start_offset)
        time_since_hints = self.now - (HINT_TIME - self.start_offset)
        hours_since_hints = (time_since_hints).total_seconds() // 3600
        # print(time_since_hints)
        # print(HOURS_PER_HINT)
        # print(hours_since_hints)

        hours = max(0, hours_since_hints)
        # print(hours)
        # print("HINT COMPUTE HOURS",hours)
        hints = math.ceil(hours / HOURS_PER_HINT)
        # print("HINT COMPUTE HINTS",hints)
        return self.total_hints_awarded + hints + FREE_HINT_CNT

    def num_hints_used(self):
        return sum(hint.consumes_hint for hint in self.asked_hints)

    def num_hints_remaining(self):
        return self.num_hints_total - self.num_hints_used

    def num_free_answers_total(self):
        if not FREE_ANSWERS_ENABLED or self.hunt_is_over:
            return 0
        # TODO: FREE ANSWERS (VOUCHER) : count the number of puzzles in event that a team has
        # print(self.main_round_solves[1]['events'])
        event_solve_cnt = self.main_round_solves[1]["events"]
        return self.total_free_answers_awarded + event_solve_cnt

        # OLD IMPLEMNTATION: based on auto unlock time.. If need to reassess, we can comment this back in and force feed hints.
        # if self.now < self.creation_time + TEAM_AGE_BEFORE_FREE_ANSWERS:
        #     return self.total_free_answers_awarded
        # days = max(0, (self.now - (FREE_ANSWER_TIME - self.start_offset)).days + 1)
        # return self.total_free_answers_awarded + sum(FREE_ANSWERS_PER_DAY[:days])

    def num_free_answers_used(self):
        return sum(1 for submission in self.submissions if submission.used_free_answer)

    def num_free_answers_remaining(self):
        return self.num_free_answers_total - self.num_free_answers_used

    def submissions(self):
        return tuple(
            self.answersubmission_set.select_related(
                "puzzle", "puzzle__round"
            ).order_by("-submitted_datetime")
        )

    def solves(self):
        return {
            submission.puzzle.slug: submission
            for submission in self.submissions
            if submission.is_correct
        }

    def unlocks(self):
        return {
            unlock.puzzle.slug: unlock.puzzle
            for unlock in self.puzzleunlock_set.select_related(
                "puzzle", "puzzle__round"
            )
        }

    def major_case_unlocks(self):
        unique_major_cases = {}
        for unlock in self.puzzleunlock_set.select_related("puzzle", "puzzle__round"):
            if (
                not unlock
                or not unlock.puzzle
                or not unlock.puzzle.round
                or not unlock.puzzle.round.major_case
            ):
                continue
            if unlock.puzzle.round.major_case.slug not in unique_major_cases:
                unique_major_cases[unlock.puzzle.round.major_case.slug] = (
                    unlock.puzzle.round.major_case
                )
        return unique_major_cases

    def major_case_puzzles(self):
        # first, calculate if there needs to be an unlock for any of the major case puzzles
        solves = self.minor_case_solves
        major_case_puzzles = {}
        current_unlocks = self.unlocks

        for i, major_case_slug in enumerate(MAJOR_CASE_SLUGS):
            if major_case_slug in current_unlocks:
                major_case_puzzles[major_case_slug] = current_unlocks[major_case_slug]
            else:
                required_case_solve_count = MAJOR_CASE_UNLOCK_SOLVE_COUNT[i]
                if (
                    major_case_slug in solves
                    and len(solves[major_case_slug]) >= required_case_solve_count
                ):
                    major_case_puzzles[major_case_slug] = Puzzle.objects.get(
                        slug=major_case_slug
                    )

        unlocks_to_make = []
        for puzzle in major_case_puzzles.values():
            if puzzle.slug not in current_unlocks:
                unlocks_to_make.append(
                    PuzzleUnlock(team=self, puzzle=puzzle, unlock_datetime=self.now)
                )

        # TODO: make a notification for every new major case unlock.

        PuzzleUnlock.objects.bulk_create(unlocks_to_make)
        return major_case_puzzles

    def case_unlocks(self):
        unique_cases = {}
        for unlock in self.puzzleunlock_set.select_related("puzzle", "puzzle__round"):
            if not unlock or not unlock.puzzle or not unlock.puzzle.round:
                continue
            if unlock.puzzle.round.slug not in unique_cases:
                unique_cases[unlock.puzzle.round.slug] = unlock.puzzle.round
        return unique_cases

    def unlocks_by_case(self):
        out = {}
        for unlock in self.puzzleunlock_set.select_related("puzzle", "puzzle__round"):
            if (
                not unlock
                or not unlock.puzzle
                or not unlock.puzzle.round
                or not unlock.puzzle.round.major_case
            ):
                continue
            if unlock.puzzle.round.major_case.slug not in out:
                out[unlock.puzzle.round.major_case.slug] = {}
            if unlock.puzzle.round.slug not in out[unlock.puzzle.round.major_case.slug]:
                out[unlock.puzzle.round.major_case.slug][unlock.puzzle.round.slug] = {}
            out[unlock.puzzle.round.major_case.slug][unlock.puzzle.round.slug][
                unlock.puzzle.slug
            ] = unlock.puzzle
        return out

    def solves_by_case(self):
        out = {}
        # major_case : minor_case : puzzle : {puzzle, solve_time, answer}
        # DOES NOT INCLUDE EVENT PUZZLES, RUNAROUND.
        for submit in self.submissions:
            if (
                not submit.is_correct
                or not submit.puzzle
                or not submit.puzzle.round
                or not submit.puzzle.round.meta
                or not submit.puzzle.round.major_case
            ):
                continue
            if submit.puzzle.round.major_case.slug not in out:
                out[submit.puzzle.round.major_case.slug] = {}
            if submit.puzzle.round.slug not in out[submit.puzzle.round.major_case.slug]:
                out[submit.puzzle.round.major_case.slug][submit.puzzle.round.slug] = {}
            if (
                submit.puzzle.slug
                not in out[submit.puzzle.round.major_case.slug][
                    submit.puzzle.round.slug
                ]
            ):
                out[submit.puzzle.round.major_case.slug][submit.puzzle.round.slug][
                    submit.puzzle.slug
                ] = submit
        return out

    def minor_case_solves(self):
        out = {}
        for submit in self.submissions:
            # brute check of all possible unhappy paths
            if (
                not submit.is_correct
                or not submit.puzzle
                or not submit.puzzle.round
                or not submit.puzzle.round.meta
                or not submit.puzzle.round.major_case
            ):
                continue
            if submit.puzzle.round.major_case.slug not in out:
                out[submit.puzzle.round.major_case.slug] = {}
            if submit.puzzle.slug == submit.puzzle.round.meta.slug:
                out[submit.puzzle.round.major_case.slug][
                    submit.puzzle.round.slug
                ] = submit
        return out

    def db_minor_case_active(self):
        return [
            active
            for active in self.minorcaseactive_set.select_related("minor_case_round")
        ]

    def db_minor_case_completed(self):
        return [
            completed
            for completed in self.minorcasecompleted_set.select_related(
                "minor_case_round"
            )
        ]

    def db_unlocks(self):
        return {
            unlock.puzzle_id: unlock
            for unlock in self.puzzleunlock_set.select_related(
                "puzzle", "puzzle__round"
            )
        }

    def main_round_solves(self):
        global_solves = 0
        local_solves = collections.defaultdict(int)
        for submission in self.solves.values():
            if submission.puzzle.is_meta:
                continue
            if submission.puzzle.round:
                local_solves[submission.puzzle.round.slug] += 1
                # if puzzle.round.slug == INTRO_ROUND_SLUG:
                #     continue
            global_solves += 1
        return (global_solves, local_solves)

    @staticmethod
    def compute_unlocks(case_unlocks, context):
        if not context.hunt_has_started and not context.is_admin:
            return []
        # computes extra unlocks that could happen due to time or local solve count

        rounds_not_unlocked = Round.objects.order_by("order").exclude(
            slug__in=case_unlocks.keys()
        )
        new_unlocks = []

        for round in rounds_not_unlocked:
            # unlocks by hours
            if 0 <= round.unlock_hours and (
                round.unlock_hours == 0
                or not context.team
                or context.team.allow_time_unlocks
            ):
                unlock_time = context.start_time + datetime.timedelta(
                    hours=round.unlock_hours
                )
                if unlock_time <= context.now:
                    case_unlocks[round.slug] = round
                    new_unlocks.append(round)

            #  starting unlocks
            if round.unlock_global_minor == 0:
                case_unlocks[round.slug] = round
                new_unlocks.append(round)

        for new_unlock in new_unlocks:
            Team.unlock_case(context.team, new_unlock, context.now)

        new_puzzle_unlocks = []
        for puzzle in context.all_puzzles:
            if (
                0 <= puzzle.unlock_global
                and puzzle.round.slug in case_unlocks
                and puzzle.unlock_global <= context.team.main_round_solves[0]
            ):
                unlock_time = context.now
                Team.unlock_puzzle(context, puzzle, unlock_time)

            if (
                0 <= puzzle.unlock_local
                and puzzle.round.slug in case_unlocks
                and puzzle.unlock_local
                <= context.team.main_round_solves[1][puzzle.round.slug]
            ):
                unlock_time = context.now
                new_puzzle_unlocks.append(
                    Team.unlock_puzzle(context, puzzle, unlock_time)
                )

        PuzzleUnlock.objects.bulk_create(new_puzzle_unlocks, ignore_conflicts=True)
        return case_unlocks

    # nlock_case(team, minor_case, unlock_datetime):

    # for puzzle in context.all_puzzles:

    # print("SOLVES:", context.team.solves)
    # metas_solved = []
    # puzzles_unlocked = collections.OrderedDict()
    # unlocks = []
    # for puzzle in context.all_puzzles:
    #     if context.team and puzzle.is_meta:
    #         if puzzle.id in context.team.solves:
    #             # print("META SOLVED:", puzzle)
    #             metas_solved.append(puzzle)
    #             # print("META SOLVED:", puzzle)
    #             metas_solved.append(puzzle)
    # # print("META SOLVED CNT:", len(metas_solved))

    # for puzzle in context.all_puzzles:
    #     unlocked_at = None
    #     if 0 <= puzzle.unlock_hours and (
    #         puzzle.unlock_hours == 0
    #         or not context.team
    #         or context.team.allow_time_unlocks
    #     ):
    #         unlock_time = context.start_time + datetime.timedelta(
    #             hours=puzzle.unlock_hours
    #         )
    #         if unlock_time <= context.now:
    #             unlocked_at = unlock_time
    #     # TODO: REMOVE TO REENABLE PRERELEASE FULL-VISIBILITY
    #     if context.is_admin or context.hunt_is_over:
    #         unlocked_at = context.start_time
    #     elif context.team and context.hunt_has_started:
    #         (global_solves, local_solves) = context.team.main_round_solves
    #         # and (global_solves or any(metas_solved)):
    #         if 0 <= puzzle.unlock_global <= global_solves:
    #             unlocked_at = context.now
    #         if 0 <= puzzle.unlock_local <= local_solves[puzzle.round.slug]:
    #             unlocked_at = context.now
    #         if 0 <= puzzle.unlock_meta <= len(metas_solved):
    #             unlocked_at = context.now
    #         # if puzzle.slug == RUNAROUND_SLUG and all(metas_solved):
    #         #     unlocked_at = context.now
    #         if puzzle.id in context.team.db_unlocks:
    #             unlocked_at = context.team.db_unlocks[puzzle.id].unlock_datetime
    #         elif unlocked_at:
    #             unlocks.append(Team.unlock_puzzle(context, puzzle, unlocked_at))
    #     if unlocked_at:
    #         puzzles_unlocked[puzzle] = unlocked_at
    # if unlocks:
    #     PuzzleUnlock.objects.bulk_create(unlocks, ignore_conflicts=True)
    # return puzzles_unlocked

    @staticmethod
    def unlock_puzzle(context, puzzle, unlocked_at):
        unlock = PuzzleUnlock(
            team=context.team, puzzle=puzzle, unlock_datetime=unlocked_at
        )
        # context.team.db_unlocks[puzzle.id] = unlock

        # TODO: reimplement unlock notification
        # if unlocked_at == context.now:
        #     show_unlock_notification(context, unlock)
        return unlock

    @staticmethod
    def unlock_case(team, minor_case, unlock_datetime):
        print(
            f"EVENT: unlocking case {minor_case} for team {team} at {unlock_datetime}"
        )

        try:
            unlock = MinorCaseActive.objects.get_or_create(
                team=team, minor_case_round=minor_case, active_datetime=unlock_datetime
            )
        except:
            print(f"Case {minor_case} already set active for team {team}.")
            return None

        # unlock all puzzles in the minor case
        puzzle_unlocks = []
        for puzzle in Puzzle.objects.filter(round=minor_case):
            try:
                # unlock all puzzles that don't require local solves.
                if puzzle.unlock_local < 0:
                    PuzzleUnlock.objects.get_or_create(
                        team=team, puzzle=puzzle, unlock_datetime=unlock_datetime
                    )
                    puzzle_unlocks.append(puzzle)
            except:
                print(f"Puzzle {puzzle} already unlocked for team {team}. Skipping.")
                pass

        return unlock, puzzle_unlocks


@receiver(post_save, sender=Team)
def notify_on_team_creation(sender, instance, created, **kwargs):
    if created:
        dispatch_general_alert(_("Team created: {}").format(instance.team_name))


class TeamMember(models.Model):
    """A person on a team."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))

    name = models.CharField(max_length=255, verbose_name=_("Name"))
    email = models.EmailField(blank=True, verbose_name=_("Email (optional)"))

    class Meta:
        verbose_name = _("team member")
        verbose_name_plural = _("team members")

    def __str__(self):
        return "%s (%s)" % (self.name, self.email) if self.email else self.name


@receiver(post_save, sender=TeamMember)
def notify_on_team_member_creation(sender, instance, created, **kwargs):
    if created:
        dispatch_general_alert(
            _("Team {} added member {} ({})").format(
                instance.team, instance.name, instance.email
            )
        )


class PuzzleUnlock(models.Model):
    """Represents a team having access to a puzzle (and when that occurred)."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    puzzle = models.ForeignKey(
        Puzzle, on_delete=models.CASCADE, verbose_name=_("puzzle")
    )

    unlock_datetime = models.DateTimeField(verbose_name=_("Unlock datetime"))
    view_datetime = models.DateTimeField(
        null=True, blank=True, verbose_name=_("View datetime")
    )

    def __str__(self):
        return "%s -> %s @ %s" % (self.team, self.puzzle, self.unlock_datetime)

    class Meta:
        unique_together = ("team", "puzzle")
        verbose_name = _("puzzle unlock")
        verbose_name_plural = _("puzzle unlocks")


class MinorCaseVote(models.Model):
    """Represents a team voting on a minor case puzzle."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    minor_case = models.ForeignKey(
        Round, on_delete=models.CASCADE, verbose_name=_("minor case")
    )
    num_votes = models.IntegerField(verbose_name=_("Number of votes"))


class MinorCaseIncomingEvent(models.Model):

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    timestamp = models.DateTimeField(verbose_name=_("Event creation datetime"))
    incoming_cases = models.ManyToManyField(
        Round, verbose_name=_("Cases"), blank=True, related_name="cases"
    )
    num_votes_allowed = models.IntegerField(
        verbose_name=_("Number of votes allowed"), default=1
    )
    votes = models.ManyToManyField(MinorCaseVote, verbose_name=_("Votes"), blank=True)
    expiration = models.DateTimeField(
        verbose_name=_("Expiration datetime"), null=True, blank=True
    )
    final_vote = models.OneToOneField(
        "MinorCaseVoteEvent",
        on_delete=models.CASCADE,
        verbose_name=_("Final vote"),
        null=True,
        blank=True,
    )
    is_initialized = models.BooleanField(
        verbose_name=_("Is initialized"), default=False
    )
    total_user_votes = models.IntegerField(
        verbose_name=_("Total user votes"), default=0
    )

    def __str__(self):
        return "%s -> %s @ %s" % (self.team, self.timestamp, self.votes)

    class Meta:
        verbose_name = _("minor case incoming event")
        verbose_name_plural = _("minor cases incoming events")

    @staticmethod
    def generate_incoming_cases(team, m):
        unlocked_cases = team.unlocks_by_case

        all_cases_list = Round.objects.all().order_by("order")
        potential_cases = [
            case
            for case in all_cases_list
            if case.major_case.slug not in unlocked_cases
            or case.slug not in unlocked_cases[case.major_case.slug]
        ]
        m = min(m, len(potential_cases))

        if m <= 0:
            return None

        incoming_cases = potential_cases[: m - 1]
        incoming_cases.append(random.choice(potential_cases[m - 1 : m + 1]))

        print(f"EVENT: Incoming cases generated: {incoming_cases}")
        return incoming_cases

    def initialize(self):
        if self.is_initialized:
            return

        team_incoming_events = MinorCaseIncomingEvent.objects.filter(team=self.team)
        number_of_cases = 4 if len(team_incoming_events) <= 2 else 3
        self.num_votes_allowed = 1 if number_of_cases < 4 else 2

        potential_cases = self.generate_incoming_cases(self.team, number_of_cases)
        if potential_cases is None:
            return
        self.incoming_cases.set(potential_cases)
        for case in potential_cases:
            vote = MinorCaseVote.objects.create(
                team=self.team, minor_case=case, num_votes=0
            )
            vote.save()
            self.votes.add(vote)

        self.is_initialized = True
        self.save()

    def get_votes(self):
        from puzzles.api.serializers import RoundSerializer

        return {
            "cases": {
                vote.minor_case.name: {
                    "round": RoundSerializer(instance=vote.minor_case).data,
                    "count": vote.num_votes,
                }
                for vote in self.votes.all()
            },
            "expiration_time": self.expiration.isoformat() if self.expiration else None,
            "max_choices": self.num_votes_allowed,
        }

    def vote(self, old_votes: list[str], new_votes: list[str]):
        votes_to_decrement = set(old_votes) - set(new_votes)
        votes_to_increment = set(new_votes) - set(old_votes)

        for old_vote in votes_to_decrement:
            vote = self.votes.get(minor_case__name=old_vote)
            if vote:
                vote.num_votes -= 1
                self.total_user_votes -= 1
                vote.save()

        for new_vote in votes_to_increment:
            vote = self.votes.get(minor_case__name=new_vote)
            if vote:
                vote.num_votes += 1
                self.total_user_votes += 1
                vote.save()

        if self.expiration is None and self.total_user_votes > 0:
            self.expiration = timezone.now() + timezone.timedelta(seconds=60)
        elif self.expiration and not old_votes and new_votes:
            self.expiration = self.expiration - timezone.timedelta(seconds=5)
        elif self.expiration and old_votes and not new_votes:
            self.expiration = self.expiration + timezone.timedelta(seconds=5)

        if self.total_user_votes == 0:
            self.expiration = None

        self.save()

    def finalize_vote(self):
        """Finalizes the vote for the incoming event, and creates a MinorCaseVoteEvent"""

        # TODO: fix this in the case where multiple cases need to be unlocked

        if self.final_vote:
            return [case.name for case in self.final_vote.selected_cases]

        sorted_votes = self.votes.order_by("-num_votes")
        most_voted_cases = [
            vote.minor_case for vote in sorted_votes[: self.num_votes_allowed]
        ]
        current_time = timezone.now()
        try:
            vote_event = MinorCaseVoteEvent.objects.create(
                team=self.team,
                timestamp=current_time,
                incoming_event=self,
            )
            vote_event.final_votes.set(self.votes.all())
            print("most voted cases: ", most_voted_cases)
            vote_event.selected_cases.set(most_voted_cases)
        except Exception as e:
            print(f"ERROR: Vote Event creation failed with error {e}")
            print("-- likely due to a vote event already existing for the team --")
            vote_event = MinorCaseVoteEvent.objects.get(
                team=self.team, incoming_event=self
            )

        self.final_vote = vote_event
        self.expiration = current_time
        self.save()

        for case in most_voted_cases:
            send_notification.send(
                None,
                notification_type="unlock",
                team=self.team.user.id,
                title="Time's Up!",
                desc=f"Team {self.team.team_name} has unlocked a new case: {case.name}!",
            )
            print(f"EVENT: Unlocking case {case.name} for team {self.team}")
            Team.unlock_case(self.team, case, self.timestamp)

        return [
            {
                "name": selected_case.name,
                "desc": selected_case.description,
            }
            for selected_case in vote_event.selected_cases.all()
        ]

    @staticmethod
    def get_current_incoming_event(context):
        """gets the current incoming event for the team, if there is one active, else returns None"""
        most_recent_case = (
            MinorCaseIncomingEvent.objects.filter(team=context.team)
            .order_by("-timestamp")
            .first()
        )

        if most_recent_case and not most_recent_case.final_vote:
            return most_recent_case

        return None

    @staticmethod
    def create_incoming_event(context):
        incoming_event = MinorCaseIncomingEvent.objects.create(
            team=context.team, timestamp=timezone.now()
        )
        incoming_event.initialize()
        return incoming_event if incoming_event.is_initialized else None


class MinorCaseVoteEvent(models.Model):
    """Represents a finalized team vote on a single puzzle"""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    timestamp = models.DateTimeField(verbose_name=_("Event creation datetime"))
    # the selected case from the vote.
    selected_cases = models.ManyToManyField(
        Round, blank=True, verbose_name=_("Selected minor case(s)")
    )
    # the incomingEvent that caused the vote to occur
    incoming_event = models.OneToOneField(
        "MinorCaseIncomingEvent",
        on_delete=models.CASCADE,
        verbose_name=_("Incoming cases event"),
    )
    # what the votes looked like at the time of the selection
    final_votes = models.ManyToManyField(
        MinorCaseVote, verbose_name=_("Final votes"), blank=True
    )


class MinorCaseActive(models.Model):
    """Represents a team having a minor case active."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    minor_case_round = models.ForeignKey(
        Round, on_delete=models.CASCADE, verbose_name=_("minor case round")
    )

    active_datetime = models.DateTimeField(verbose_name=_("Active datetime"))

    def __str__(self):
        return "%s -> %s @ %s" % (
            self.team,
            self.minor_case_round,
            self.active_datetime,
        )

    class Meta:
        unique_together = ("team", "minor_case_round")
        verbose_name = _("minor case active")
        verbose_name_plural = _("minor cases active")


class MinorCaseCompleted(models.Model):
    """Represents a team completing a minor case."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    minor_case_round = models.ForeignKey(
        Round, on_delete=models.CASCADE, verbose_name=_("minor case round")
    )

    completed_datetime = models.DateTimeField(verbose_name=_("Completed datetime"))

    def __str__(self):
        return "%s -> %s @ %s" % (
            self.team,
            self.minor_case_round,
            self.completed_datetime,
        )

    class Meta:
        unique_together = ("team", "minor_case_round")
        verbose_name = _("minor case completed")
        verbose_name_plural = _("minor cases completed")

    def save(self, *args, **kwargs):
        super(MinorCaseCompleted, self).save(*args, **kwargs)

        incoming_case_event = MinorCaseIncomingEvent.create_incoming_event(self.team)
        if incoming_case_event:
            create_minor_case_incoming_event.send(
                None,
                id=incoming_case_event.id,
                cases=incoming_case_event.get_votes(),
                team=self.team.id,
                max_choices=incoming_case_event.num_votes_allowed,
            )
            incoming_case_event.save()

        StorylineUnlock.activate_non_storyline_dialogue(
            f"{self.minor_case_round.slug}-case-solve"
        )


class MajorCaseCompleted(models.Model):
    """Represents a team completing a major case."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    major_case = models.ForeignKey(
        MajorCase, on_delete=models.CASCADE, verbose_name=_("major case")
    )

    completed_datetime = models.DateTimeField(verbose_name=_("Completed datetime"))

    def __str__(self):
        return "%s -> %s @ %s" % (
            self.team,
            self.major_case_round,
            self.completed_datetime,
        )

    class Meta:
        unique_together = ("team", "major_case")
        verbose_name = _("major case completed")
        verbose_name_plural = _("major cases completed")

    # team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    #     storyline = models.SlugField(verbose_name=_("Storyline Slug (in frontend)"))
    #     unlock_datetime = models.DateTimeField(verbose_name=_("Unlock datetime"))
    def save(self, *args, **kwargs):
        super(MajorCaseCompleted, self).save(*args, **kwargs)

        num_major_case_solves = MajorCaseCompleted.objects.filter(
            team=self.team
        ).count()

        story_unlock = StorylineUnlock.objects.create(
            team=self.team,
            storyline=f"major-case-complete-{num_major_case_solves}",
        )
        story_unlock.save()


class AnswerSubmission(models.Model):
    """Represents a team making a solve attempt on a puzzle (right or wrong)."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    puzzle = models.ForeignKey(
        Puzzle, on_delete=models.CASCADE, verbose_name=_("puzzle")
    )

    submitted_answer = models.CharField(
        max_length=255, verbose_name=_("Submitted answer")
    )
    is_correct = models.BooleanField(verbose_name=_("Is correct"))
    submitted_datetime = models.DateTimeField(
        auto_now_add=True, verbose_name=_("Submitted datetime")
    )
    used_free_answer = models.BooleanField(verbose_name=_("Used free answer"))

    def __str__(self):
        return "%s -> %s: %s, %s" % (
            self.team,
            self.puzzle,
            self.submitted_answer,
            _("correct") if self.is_correct else _("wrong"),
        )

    class Meta:
        unique_together = ("team", "puzzle", "submitted_answer")
        verbose_name = _("answer submission")
        verbose_name_plural = _("answer submissions")


@receiver(post_save, sender=AnswerSubmission)
def notify_on_answer_submission(sender, instance, created, **kwargs):
    if created:
        now = timezone.localtime()

        def format_time_ago(timestamp):
            if not timestamp:
                return ""
            diff = now - timestamp
            parts = ["", "", "", ""]
            if diff.days > 0:
                parts[0] = _("%dd") % diff.days
            seconds = diff.seconds
            parts[3] = _("%02ds") % (seconds % 60)
            minutes = seconds // 60
            if minutes:
                parts[2] = _("%02dm") % (minutes % 60)
                hours = minutes // 60
                if hours:
                    parts[1] = _("%dh") % hours
            return _(" {} ago").format("".join(parts))

        hints = Hint.objects.filter(team=instance.team, puzzle=instance.puzzle)
        hint_line = ""
        if len(hints):
            hint_line = _("\nHints:") + ",".join(
                "%s (%s%s)"
                % (
                    format_time_ago(hint.submitted_datetime),
                    hint.get_status_display(),
                    format_time_ago(hint.answered_datetime),
                )
                for hint in hints
            )
        if instance.used_free_answer:
            pass
        else:
            submitted_teams = (
                AnswerSubmission.objects.filter(
                    puzzle=instance.puzzle,
                    submitted_answer=instance.submitted_answer,
                    used_free_answer=False,
                    team__is_hidden=False,
                )
                .values_list("team_id", flat=True)
                .distinct()
                .count()
            )
            sigil = ":x:"
            if instance.is_correct:
                sigil = {
                    1: ":first_place:",
                    2: ":second_place:",
                    3: ":third_place:",
                }.get(submitted_teams, ":white_check_mark:")
            elif submitted_teams > 1:
                sigil = ":skull_crossbones:"
            dispatch_submission_alert(
                _("{} {} Team {} submitted `{}` for {}: {}{}").format(
                    sigil,
                    instance.puzzle.emoji,
                    instance.team,
                    instance.submitted_answer,
                    instance.puzzle,
                    _("Correct!") if instance.is_correct else _("Incorrect."),
                    hint_line,
                ),
                correct=instance.is_correct,
                is_major_meta=instance.puzzle.is_major_meta,
                is_minor_meta=instance.puzzle.is_meta,
            )
        if not instance.is_correct:
            return
        # show_solve_notification(instance)
        obsoleted_hints = Hint.objects.filter(
            team=instance.team,
            puzzle=instance.puzzle,
            status=Hint.NO_RESPONSE,
        )
        # Do this instead of obsoleted_hints.update(status=Hint.OBSOLETE,
        # answered_datetime=now) to trigger post_save.
        for hint in obsoleted_hints:
            hint.status = Hint.OBSOLETE
            hint.answered_datetime = now
            hint.save()


class ExtraGuessGrant(models.Model):
    """Extra guesses granted to a particular team."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    puzzle = models.ForeignKey(
        Puzzle, on_delete=models.CASCADE, verbose_name=_("puzzle")
    )

    extra_guesses = models.IntegerField(verbose_name=_("Extra guesses"))

    def __str__(self):
        return _("%s has %d extra guesses for puzzle %s") % (
            self.team,
            self.extra_guesses,
            self.puzzle,
        )

    class Meta:
        unique_together = ("team", "puzzle")
        verbose_name = _("extra guess grant")
        verbose_name_plural = _("extra guess grants")


class PuzzleMessage(models.Model):
    """A "keep going" message shown on submitting a specific wrong answer."""

    puzzle = models.ForeignKey(
        Puzzle, on_delete=models.CASCADE, verbose_name=_("puzzle")
    )

    guess = models.CharField(max_length=255, verbose_name=_("Guess"))
    response = models.TextField(verbose_name=_("Response"))

    class Meta:
        verbose_name = _("puzzle message")
        verbose_name_plural = _("puzzle messages")

    def __str__(self):
        return "%s: %s" % (self.puzzle, self.guess)

    @property
    def semicleaned_guess(self):
        return PuzzleMessage.semiclean_guess(self.guess)

    @staticmethod
    def semiclean_guess(s):
        if s is None:
            return s
        nfkd_form = unicodedata.normalize("NFKD", s)
        return "".join([c.upper() for c in nfkd_form if c.isalnum()])


class Erratum(models.Model):
    """An update made to the hunt while it's running that should be announced."""

    puzzle = models.ForeignKey(
        Puzzle,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name=_("puzzle"),
    )
    updates_text = models.TextField(
        blank=True,
        verbose_name=_("Updates text"),
        help_text=_(
            '''
        Text to show on the Updates (errata) page. If blank, it will not appear there.
        Use $PUZZLE to refer to the puzzle. The text will be prefixed with "On
        (date)," when displayed, so you should capitalize it the way it would
        appear mid-sentence. HTML is ok.
    """
        ),
    )
    puzzle_text = models.TextField(
        blank=True,
        verbose_name=_("Puzzle text"),
        help_text=_(
            """
        Text to show on the puzzle page. If blank, it will not appear there.
        The text will be prefixed with "On (date)," when displayed, so you
        should capitalize it the way it would appear mid-sentence. HTML is ok.
    '''
        ),
    )
    timestamp = models.DateTimeField(default=timezone.now, verbose_name=_("Timestamp"))
    published = models.BooleanField(default=False, verbose_name=_("Published"))

    def __str__(self):
        return _("%s erratum @ %s") % (self.puzzle, self.timestamp)

    @property
    def formatted_updates_text(self):
        return self.updates_text
        # return self.updates_text.replace(
        #     "$PUZZLE",
        #     '<a href="%s">%s</a>'
        #     % (reverse("puzzle", args=(self.puzzle.slug,)), self.puzzle),
        # )

    @staticmethod
    def get_visible_errata(context):
        errata = []
        for erratum in Erratum.objects.select_related("puzzle").order_by("timestamp"):
            if not context.is_superuser:
                if not erratum.published:
                    continue
                if erratum.puzzle and erratum.puzzle not in context.unlocks:
                    continue
            errata.append(erratum)
        return errata

    def get_emails(self):
        teams = (
            PuzzleUnlock.objects.filter(puzzle=self.puzzle)
            .exclude(view_datetime=None)
            .values_list("team_id", flat=True)
        )
        return (
            TeamMember.objects.filter(team_id__in=teams)
            .exclude(email="")
            .values_list("email", flat=True)
        )

    class Meta:
        verbose_name = _("erratum")
        verbose_name_plural = _("errata")


class RatingField(models.PositiveSmallIntegerField):
    """Represents a single numeric rating (either fun or difficulty) of a puzzle."""

    def __init__(self, max_rating, adjective, **kwargs):
        self.max_rating = max_rating
        self.adjective = adjective
        super().__init__(**kwargs)

    def formfield(self, **kwargs):
        choices = [(i, i) for i in range(1, self.max_rating + 1)]
        return super().formfield(
            **{
                "min_value": 1,
                "max_value": self.max_rating,
                "widget": forms.RadioSelect(
                    choices=choices,
                    attrs={"adjective": self.adjective},
                ),
                **kwargs,
            }
        )

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs["max_rating"] = self.max_rating
        kwargs["adjective"] = self.adjective
        return name, path, args, kwargs


class Survey(models.Model):
    """A rating given by a team to a puzzle after solving it."""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    puzzle = models.ForeignKey(
        Puzzle, on_delete=models.CASCADE, verbose_name=_("puzzle")
    )
    submitted_datetime = models.DateTimeField(
        auto_now=True, verbose_name=_("Submitted datetime")
    )

    # NOTE: Due to some pretty dynamic queries, the names of rating fields
    # should be pretty unique! They definitely shouldn't overlap with the names
    # of any fields of Puzzle.
    fun = RatingField(6, _("fun"))
    difficulty = RatingField(6, _("hard"))
    comments = models.TextField(blank=True, verbose_name=_("Anything else:"))

    def __str__(self):
        return "%s: %s" % (self.puzzle, self.team)

    class Meta:
        verbose_name = _("survey")
        verbose_name_plural = _("surveys")

    @classmethod
    def fields(cls):
        return [
            field for field in cls._meta.get_fields() if isinstance(field, RatingField)
        ]


class Hint(models.Model):
    """A request for a hint."""

    NO_RESPONSE = "NR"
    ANSWERED = "ANS"
    REFUNDED = "REF"
    OBSOLETE = "OBS"

    STATUSES = (
        (NO_RESPONSE, _("No response")),
        (ANSWERED, _("Answered")),
        # we can't answer for some reason, or think that the hint is too small
        (REFUNDED, _("Refunded")),
        # puzzle was solved while waiting for hint
        (OBSOLETE, _("Obsolete")),
    )

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    puzzle = models.ForeignKey(
        Puzzle, on_delete=models.CASCADE, verbose_name=_("puzzle")
    )
    is_followup = models.BooleanField(default=False, verbose_name=_("Is followup"))

    submitted_datetime = models.DateTimeField(
        auto_now_add=True, verbose_name=_("Submitted datetime")
    )
    hint_question = models.TextField(verbose_name=_("Hint question"))
    notify_emails = models.CharField(
        default="none", max_length=255, verbose_name=_("Notify emails")
    )

    claimed_datetime = models.DateTimeField(
        null=True, blank=True, verbose_name=_("Claimed datetime")
    )
    # Making these null=True, blank=False is painful and apparently not
    # idiomatic Django. For example, if set that way, the Django admin won't
    # let you save a model with blank values. Just check for the empty string
    # or falsiness when you're using them.
    claimer = models.CharField(blank=True, max_length=255, verbose_name=_("Claimer"))
    discord_id = models.CharField(
        blank=True, max_length=255, verbose_name=_("Discord id")
    )

    answered_datetime = models.DateTimeField(
        null=True, blank=True, verbose_name=_("Answered datetime")
    )
    status = models.CharField(
        choices=STATUSES, default=NO_RESPONSE, max_length=3, verbose_name=_("Status")
    )
    response = models.TextField(blank=True, verbose_name=_("Response"))

    class Meta:
        verbose_name = _("hint")
        verbose_name_plural = _("hints")

    def __str__(self):
        def abbr(s):
            if len(s) > 50:
                return s[:47] + "..."
            return s

        o = '{}, {}: "{}"'.format(
            self.team.team_name,
            self.puzzle.name,
            abbr(self.hint_question),
        )
        if self.status != self.NO_RESPONSE:
            o = o + " {}".format(self.get_status_display())
        return o

    @property
    def consumes_hint(self):
        if self.status == Hint.REFUNDED:
            return False
        if self.status == Hint.OBSOLETE:
            return False
        if self.is_followup:
            return False
        return True

    def recipients(self):
        if self.notify_emails == "all":
            return self.team.get_emails()
        if self.notify_emails == "none":
            return []
        return [self.notify_emails]

    def full_url(self, claim=False):
        url = settings.DOMAIN + "hint/%s" % self.id
        if claim:
            url += "?claim=true"
        return url

    def short_discord_message(self, threshold=500):
        return (_("[{}](<{}>) requested on {} **{}** by {}\n" "```{}```\n")).format(
            _("*Followup hint*") if self.is_followup else _("Hint"),
            self.full_url(),
            self.puzzle.emoji,
            self.puzzle,
            self.team,
            self.hint_question[:threshold],
        )

    def long_discord_message(self):
        return self.short_discord_message(1000) + (
            _(
                "[View team](<{}>)  |  [View all hints from this team](<{}>)\n"
                "[View puzzle](<{}>)  |  [View all puzzle hints](<{}>)\n"
            )
        ).format(
            settings.DOMAIN + "team/%s" % self.team.id,
            settings.DOMAIN + "hints?team=%s" % self.team_id,
            settings.DOMAIN + "puzzle/" + self.puzzle.slug,
            settings.DOMAIN + "hints?puzzle=%s" % self.puzzle_id,
        )


class VoiceRecording(models.Model):
    """A component of an interactive "database puzzle" consisting of many chat transcripts."""

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transcript = models.TextField(
        verbose_name=_("Transcript"),
    )
    search_text = models.TextField(
        verbose_name=_("Search Text"),
        help_text=_(
            "Text used for search indexing. Excludes characters named and sound effects"
        ),
    )
    hour = models.IntegerField(verbose_name=_("Recording Hour"))
    # timestamp = models.IntegerField(verbose_name=_("Recording Hour"))
    audio_url = models.URLField(verbose_name=_("Audio URL"), null=True, blank=True)
    characters = models.TextField(verbose_name=_("Characters"))

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self._meta.fields}

    class Meta:
        indexes = [
            GinIndex(
                fields=["transcript"],
                opclasses=["gin_trgm_ops"],
                name="transcript_trgm_idx",
            )
        ]


@receiver(post_save, sender=Hint)
def notify_on_hint_update(sender, instance, created, update_fields, **kwargs):
    # The .save() calls when updating certain Hint fields pass update_fields
    # to control which fields are written, which can be checked here. This is
    # to be safe and prevent overtriggering of these handlers, e.g. spamming
    # the team with more emails if an answered hint is somehow claimed again.
    # return
    if not update_fields:
        update_fields = ()
    if instance.status == Hint.NO_RESPONSE:
        if "discord_id" not in update_fields:
            discord_interface.update_hint(instance)
    else:
        if "discord_id" not in update_fields:
            discord_interface.clear_hint(instance)
        # if "response" in update_fields:
        # TODO: fix later
        # link = settings.DOMAIN.rstrip("/") + reverse(
        #     "hints", args=(instance.puzzle.slug,)
        # )
        # send_mail_wrapper(
        #     _("Hint answered for {}").format(instance.puzzle),
        #     "hint_answered_email",
        #     {"hint": instance, "link": link},
        #     instance.recipients(),
        # )
        # show_hint_notification(instance)


class StorylineUnlock(models.Model):
    """Represents a team's unlock for a core part of the story"""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name=_("team"))
    storyline = models.SlugField(verbose_name=_("Storyline Slug (in frontend)"))
    unlock_datetime = models.DateTimeField(verbose_name=_("Unlock datetime"))

    def __str__(self):
        return "%s -> %s @ %s" % (self.team, self.storyline, self.unlock_datetime)

    class Meta:
        unique_together = ("team", "storyline")
        verbose_name = _("storyline unlock")
        verbose_name_plural = _("storyline unlocks")

    def save(self, *args, **kwargs):
        super(StorylineUnlock, self).save(*args, **kwargs)
        # TODO: add story notification / SSE to move bluenoir

    @staticmethod
    def activate_non_storyline_dialogue(storyline_slug: str):
        # TODO: add story notification / SSE to make bluenoir talk
        return
