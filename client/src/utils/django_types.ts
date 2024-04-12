import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_staff: z.boolean(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  date_joined: z.string(),
});
type User = z.infer<typeof UserSchema>;

const UserTeamSchema = z.object({
  id: z.number(),
  team_name: z.string(),
  creation_time: z.string(),
  start_offset: z.string(),
  allow_time_unlocks: z.boolean(),
  total_hints_awarded: z.number(),
  num_hints_remaining: z.number(),
  num_hints_used: z.number(),
  num_hints_total: z.number(),
  total_free_answers_awarded: z.number(),
  last_solve_time: z.string().nullable(),
  is_prerelease_testsolver: z.boolean(),
  num_brown_members: z.number(),
  is_hidden: z.boolean(),
  brown_team: z.boolean(),
  in_person: z.boolean(),
  classroom_need: z.boolean(),
  where_to_find: z.string(),
  phone_number: z.string(),
  user: z.number(),
  emoji_choice: z.string(),
  color_choice: z.string(),
});
type UserTeam = z.infer<typeof UserTeamSchema>;

const TeamSchema = z.object({
  id: z.number(),
  team_name: z.string(),
  emoji_choice: z.string(),
  color_choice: z.string(),
  in_person: z.boolean(),
  is_hidden: z.boolean(),
});
type Team = z.infer<typeof TeamSchema>;

const TeamMemberSchema = z.object({
  name: z.string(),
  email: z.string(),
});
type TeamMember = z.infer<typeof TeamMemberSchema>;

const ErratumSchema = z.object({
  id: z.number(),
  updates_text: z.string(),
  timestamp: z.date(),
  published: z.boolean(),
});
type Erratum = z.infer<typeof ErratumSchema>;

const AnswerSubmissionSchema = z.object({
  id: z.number(),
  submitted_answer: z.string(),
  is_correct: z.boolean(),
  submitted_datetime: z.date(),
  used_free_answer: z.boolean(),
});
type AnswerSubmission = z.infer<typeof AnswerSubmissionSchema>;

const MajorCaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  slug: z.string(),
  puzzle: z.object({
    // TODO: don't know how to type this yet. import cycle with other schemas, so shallow typing quick solution.
    name: z.string(),
    slug: z.string(),
    submissions: z.array(AnswerSubmissionSchema),
  }),
  submissions: z.array(AnswerSubmissionSchema),
});
type MajorCase = z.infer<typeof MajorCaseSchema>;

export const RoundSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  order: z.number(),
  major_case: MajorCaseSchema,
  description: z.string(),
  unlock_global_minor: z.number(),
  unlock_local_major: z.number(),
});
type Round = z.infer<typeof RoundSchema>;

const PuzzleSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  order: z.number(),
  is_meta: z.boolean(),
  is_major_meta: z.boolean(),
  round: RoundSchema,
  body: z.string(),
  body_remote: z.string(),
  solution: z.string(),
  clipboard: z.string(),
  clipboard_remote: z.string(),
  submissions: z.array(AnswerSubmissionSchema),
  errata: z.array(ErratumSchema),
});
type Puzzle = z.infer<typeof PuzzleSchema>;

const PuzzleMessageSchema = z.object({
  id: z.number(),
  guess: z.string(),
  response: z.string(),
  puzzle: PuzzleSchema,
});
type PuzzleMessage = z.infer<typeof PuzzleMessageSchema>;

const MinorCaseIncomingSchema = z.object({
  id: z.number(),
  incoming_datetime: z.date(),
  minor_case_round: RoundSchema,
});
type MinorCaseIncoming = z.infer<typeof MinorCaseIncomingSchema>;

const MinorCaseVote = z.object({
  id: z.number(),
  minor_case: RoundSchema,
  num_votes: z.number(),
});

const MinorCaseActiveSchema = z.object({
  id: z.number(),
  active_datetime: z.date(),
  minor_case_round: RoundSchema,
});
type MinorCaseActive = z.infer<typeof MinorCaseActiveSchema>;

const MinorCaseCompletedSchema = z.object({
  id: z.number(),
  completed_datetime: z.date(),
  minor_case_round: RoundSchema,
});
type MinorCaseCompleted = z.infer<typeof MinorCaseCompletedSchema>;

const MinorCaseIncomingEventSchema = z.object({
  id: z.number(),
  team: TeamSchema,
  timestamp: z.date(),
  incoming_cases: z.array(RoundSchema),
  votes: z.array(MinorCaseVote),
  is_initialized: z.boolean(),
  total_user_votes: z.number(),
});
type MinorCaseIncomingEvent = z.infer<typeof MinorCaseIncomingEventSchema>;

const EventSchema = z.object({
  slug: z.string(),
  name: z.string(),
  timestamp: z.date().nullable(),
  message: z.string(),
  location: z.string(),
  is_final_runaround: z.boolean(),
  answer: z.string(),
});
interface InPersonEvent extends z.infer<typeof EventSchema> {}

const EventCompletionSchema = z.object({
  team: TeamSchema,
  event: EventSchema,
  completion_datetime: z.date(),
});
interface EventCompletion extends z.infer<typeof EventCompletionSchema> {}

const TeamPuzzleContextSchema = z.object({
  is_admin: z.boolean(),
  is_superuser: z.boolean(),
  is_prerelease_testsolver: z.boolean(),
  in_person: z.boolean(),
  num_hints_remaining: z.number(),
  num_free_answers_remaining: z.number(),
  minor_case_solves: z.record(z.record(AnswerSubmissionSchema)),
  minor_case_incoming: z.array(MinorCaseIncomingSchema),
  minor_case_active: z.array(MinorCaseActiveSchema),
  minor_case_completed: z.array(MinorCaseCompletedSchema),
  solves: z.record(AnswerSubmissionSchema),
  solves_by_case: z.record(z.record(z.record(AnswerSubmissionSchema))), // major_case -> case_id -> puzzle_id -> answer submission
  unlocks: z.record(z.record(z.record(PuzzleSchema))), // major_case_id -> case_id -> puzzle_id -> puzzle
  case_unlocks: z.record(RoundSchema),
  major_case_unlocks: z.record(MajorCaseSchema),
  major_case_puzzles: z.record(PuzzleSchema),
  major_case_solves: z.record(AnswerSubmissionSchema),
  current_incoming_event: MinorCaseIncomingEventSchema,
  completed_events: z.record(EventCompletionSchema),
});

const HuntContextSchema = z.object({
  start_time: z.date(),
  time_since_start: z.date(),
  end_time: z.date(),
  close_time: z.date(),
  hunt_is_prereleased: z.boolean(),
  hunt_has_started: z.boolean(),
  hunt_is_over: z.boolean(),
  hunt_is_closed: z.boolean(),
  max_guesses_per_puzzle: z.number(),
  max_members_per_team: z.number(),
  hours_per_hint: z.number(),
});

const ContextSchema = z.object({
  team_context: TeamPuzzleContextSchema,
  hunt_context: HuntContextSchema,
});
type DjangoContext = z.infer<typeof ContextSchema>;

const MinorCaseSchema = z.object({
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  major_case: MajorCaseSchema,
  //
});
type MinorCase = z.infer<typeof MinorCaseSchema>;

const VotingInfoSchema = z.object({
  id: z.number(),
  cases: z.record(z.object({ round: RoundSchema, count: z.number().nonnegative() })),
  expiration_time: z.string().nullable(),
  max_choices: z.number().nonnegative(),
});
interface VotingInfo extends z.infer<typeof VotingInfoSchema> {}

/**
 * class Hint(models.Model):
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

 */

const HintSchema = z.object({
  id: z.number(),
  team: z.number().int(),
  puzzle: z.number().int(),
  is_followup: z.boolean(),
  is_followed_up_on: z.boolean(),
  submitted_datetime: z.string(),
  hint_question: z.string(),
  notify_emails: z.string(),
  claimed_datetime: z.string().nullable(),
  claimer: z.string(),
  discord_id: z.string(),
  answered_datetime: z.string().nullable(),
  status: z.string(),
  response: z.string(),
});
interface Hint extends z.infer<typeof HintSchema> {}

type Token = { key: string; id: number };

interface SuccessResponse<T> {
  data: T;
  success: true;
}
interface ErrorResponse {
  error: string;
  success: false;
}
type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

export type {
  APIResponse,
  AnswerSubmission,
  DjangoContext,
  Erratum,
  EventCompletion,
  Hint,
  InPersonEvent,
  MajorCase,
  MinorCase,
  MinorCaseActive,
  MinorCaseCompleted,
  MinorCaseIncoming,
  MinorCaseIncomingEvent,
  Puzzle,
  PuzzleMessage,
  Round,
  Team,
  TeamMember,
  Token,
  User,
  UserTeam,
  VotingInfo,
};
