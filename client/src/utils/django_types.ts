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

type Biggraph = [number, number, string, boolean];

type SolveInfo = Record<string, { puzzle_name: string; solvedAt: string }[]>;

interface LeaderboardTeam extends Team {
  total_solves: number;
  major_case_solve_count: number;
  minor_case_solve_count: number;
  last_solve_or_creation_time: string;
  all_metas_solve_time: string;
}

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

interface TeamStatsInner {
  name: string;
  slug: string;
  incorrect_guesses: number;
  unlock_time: string;
  solve_time: string;
}

interface TeamStats {
  name: string;
  id: number;
  total_solves: number;
  stats: Record<string, TeamStatsInner>;
}

interface TeamPuzzleStats {
  name: string;
  id: number;
  incorrect_guesses: number;
  unlock_time: string;
  solve_time: string;
  num_hints: number;
}

interface PuzzleStatsBase {
  name: string;
  total_solves: number;
  guesses: number;
  unlocks: number;
}

interface PuzzleStats extends PuzzleStatsBase {
  name: string;
  total_solves: number;
  guesses: number;
  hints: number;
  unlocks: number;
  submissions: Record<string, TeamPuzzleStats>;
  answer: string;
}

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
  meta: z.number(),
});
type Round = z.infer<typeof RoundSchema>;

const PuzzleSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  answer: z.string(),
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
  requires_answer: z.boolean(),
});
interface InPersonEvent extends z.infer<typeof EventSchema> {}

const EventCompletionSchema = z.object({
  team: TeamSchema,
  event: EventSchema,
  completion_datetime: z.date(),
});
interface EventCompletion extends z.infer<typeof EventCompletionSchema> {}

const StorylineUnlockSchema = z.object({
  id: z.number(),
  team: TeamSchema,
  storyline: z.string(),
  unlock_datetime: z.string(),
});
interface StorylineUnlock extends z.infer<typeof StorylineUnlockSchema> {}

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
  storyline_unlocks: z.array(StorylineUnlockSchema),
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

export const VotingInfoSchema = z.object({
  id: z.number(),
  cases: z.record(z.object({ round: RoundSchema, count: z.number().nonnegative() })),
  expiration_time: z.string().nullable(),
  max_choices: z.number().nonnegative(),
});
interface VotingInfo extends z.infer<typeof VotingInfoSchema> {}

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
  Biggraph,
  DjangoContext,
  Erratum,
  EventCompletion,
  Hint,
  InPersonEvent,
  LeaderboardTeam,
  MajorCase,
  MinorCase,
  MinorCaseActive,
  MinorCaseCompleted,
  MinorCaseIncoming,
  MinorCaseIncomingEvent,
  Puzzle,
  PuzzleMessage,
  PuzzleStats,
  PuzzleStatsBase,
  Round,
  SolveInfo,
  StorylineUnlock,
  Team,
  TeamMember,
  TeamPuzzleStats,
  TeamStats,
  TeamStatsInner,
  Token,
  User,
  UserTeam,
  VotingInfo,
};
