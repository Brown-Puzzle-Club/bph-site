import datetime
from django.urls import reverse
from django.utils import timezone

# included in various templates. NOTE, sometimes appears with a "the" before
# it, maybe check those are what you want.
HUNT_TITLE = "Brown Puzzlehunt"
# included in various templates and displayed on the static site
HUNT_ORGANIZERS = "Brown Puzzle Club"
# included in various templates and set as reply-to for automatic emails
CONTACT_EMAIL = "puzzle@brown.edu"
# the sender from which automatic emails are sent; your mail sending service
# might require you set this to something (check settings/base.py to put your
# actual mail sending service credentials)
MESSAGING_SENDER_EMAIL = "no-reply@FIXME.example.com"

# Change this to True to reveal the story page to everyone.
STORY_PAGE_VISIBLE = False
# Change this to True when the wrapup exists.
WRAPUP_PAGE_VISIBLE = True
# Change this to True to start showing solve and guess counts on each puzzle.
# Full stats are automatically available to superusers and after hunt end.
INITIAL_STATS_AVAILABLE = False
# Change this to True to start showing post-solve surveys to teams.
# Survey results are only available to superusers.
SURVEYS_AVAILABLE = False

HUNT_START_TIME = timezone.make_aware(
    datetime.datetime(
        year=2024,
        month=4,
        day=13,
        hour=12,
        minute=0,
    )
)
HUNT_END_TIME = timezone.make_aware(
    datetime.datetime(
        year=2024,
        month=4,
        day=14,
        hour=23,
        minute=59,
    )
)
HUNT_CLOSE_TIME = timezone.make_aware(
    datetime.datetime(
        year=2024,
        month=4,
        day=21,
        hour=23,
        minute=59,
    )
)
HUNT_SOLUTION_TIME = timezone.make_aware(
    datetime.datetime(
        year=2024,
        month=4,
        day=21,
        hour=23,
        minute=59,
    )
)

MAX_GUESSES_PER_PUZZLE = 20
MAX_MEMBERS_PER_TEAM = 12

# If this is disabled, teams will not get any hints.
HINTS_ENABLED = True
# Teams accumulate this many hints each day.
# HINTS_PER_DAY = (2, 2, 2, 2, 2, 2, 2, 2, 2, 2)
# number of hours a team has to wait for their next hint.
HOURS_PER_HINT = 3
# Teams get the first number in HINTS_PER_DAY at this time, and subsequent
# numbers every day after until the end of HINTS_PER_DAY.
HINT_TIME = HUNT_START_TIME + datetime.timedelta(hours=2)
# To discourage teams from creating sockpuppets to grab more hints, teams
# created less than this time ago get nothing. Once the time elapses, they
# get the full number of hints, including retroactively.
# (We tried shifting the hint schedule back for teams depending on creation
# time, but it's hard to do fairly. Teams were confused about when and how
# many hints they would get, since we advertised that there would be intro
# hints or extra hints released at this or that time. Feel free to change the
# logic in models.py to suit your needs.)
TEAM_AGE_BEFORE_HINTS = datetime.timedelta(hours=1)
# If set, a team's first N hints are usable only on puzzles in the intro round.
# (They don't go away or convert into regular hints after some time; if a team
# doesn't use them, they can still use regular hints they receive afterward.)
INTRO_HINTS = 0
# If this is enabled, a team may only have one open hint, and must wait for it
# to be answered before submitting another request.
ONE_HINT_AT_A_TIME = True

# These options are exactly analogous to the above.
FREE_ANSWERS_ENABLED = False
FREE_ANSWERS_PER_DAY = (0, 0, 0)
FREE_ANSWER_TIME = HUNT_START_TIME + datetime.timedelta(days=6)
TEAM_AGE_BEFORE_FREE_ANSWERS = datetime.timedelta(days=3)

MAJOR_CASE_SLUGS = ["colored-thread", "social-deduction", "data"]
MAJOR_CASE_UNLOCK_SOLVE_COUNT = [3, 4, 5]
