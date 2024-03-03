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

const AnswerSubmissionSchema = z.object({
  id: z.number(),
  submitted_answer: z.string(),
  is_correct: z.boolean(),
  submitted_datetime: z.date(),
  used_free_answer: z.boolean(),
});
type AnswerSubmission = z.infer<typeof AnswerSubmissionSchema>;

const RoundSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  major_case: z.string().nullable(),
  description: z.string(),
  unlock_global_minor: z.number(),
  unlock_local_major: z.number(),
});
type Round = z.infer<typeof RoundSchema>;

const MinorCaseIncomingSchema = z.object({
  id: z.number(),
  incoming_datetime: z.date(),
  minor_case_round: RoundSchema,
});
type MinorCaseIncoming = z.infer<typeof MinorCaseIncomingSchema>;

const MinorCaseActiveSchema = z.object({
  id: z.number(),
  active_datetime: z.date(),
  minor_case_round: RoundSchema,
});
type MinorCaseActive = z.infer<typeof MinorCaseActiveSchema>;

const MinorCaseCompletedSchema = z.object({
  id: z.number(),
  active_datetime: z.date(),
  minor_case_round: RoundSchema
});
type MinorCaseCompleted = z.infer<typeof MinorCaseCompletedSchema>;

// TODO: fix
// const PuzzleSchema = z.object({
//   name: z.string(),
//   description: z.string(),
//   slug: z.string(),
//   data: z.date(),
// });

const TeamPuzzleContextSchema = z.object({
  is_admin: z.boolean(),
  is_superuser: z.boolean(),
  num_hints_remaining: z.number(),
  num_free_answers_remaining: z.number(),
  solves_by_case: z.record(z.record(z.record(AnswerSubmissionSchema))),
  minor_case_solves: z.record(z.record(AnswerSubmissionSchema)),
  minor_case_incoming: z.array(MinorCaseIncomingSchema),
  minor_case_active: z.array(MinorCaseActiveSchema),
  minor_case_completed: z.array(MinorCaseCompletedSchema),
  unlocks: z.record(z.date())
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
  //
});
type MinorCase = z.infer<typeof MinorCaseSchema>;


export type { AnswerSubmission, DjangoContext, MinorCaseActive, MinorCaseIncoming, MinorCaseCompleted, Round, Team, TeamMember, User, UserTeam, MinorCase };


