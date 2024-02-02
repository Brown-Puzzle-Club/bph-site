import { z } from "zod";

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
  is_hidden: z.boolean(),
  brown_members: z.boolean(),
  brown_affiliation_desc: z.string(),
  in_person_sat: z.number(),
  in_person_sun: z.number(),
  classroom_need: z.boolean(),
  location: z.string(),
  phone_number: z.string(),
  merge_out: z.boolean(),
  merge_out_preferences: z.string(),
  merge_in: z.boolean(),
  merge_in_preferences: z.string(),
  user: z.number(),
});
type UserTeam = z.infer<typeof UserTeamSchema>;

const TeamSchema = z.object({
  id: z.number(),
  team_name: z.string(),
});
type Team = z.infer<typeof TeamSchema>;



export type { Team, UserTeam };

