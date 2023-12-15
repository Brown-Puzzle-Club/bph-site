import { z } from "zod";

const contextSchema = z.object({
  team: z
    .object({
      team_name: z.string(),
      total_hints_awarded: z.number().int(),
      num_hints_remaining: z.number().int(),
      total_free_answers_awarded: z.number().int(),
      num_free_answers_remaining: z.number().int(),
      is_prerelease_testsolver: z.boolean(),
      brown_members: z.boolean(),
      in_person: z.boolean(),
    })
    .optional(),
  unlocks: z.record(z.string().transform((x) => new Date(x))),
  rounds: z.record(z.string().transform((x) => new Date(x))),
  // TODO: make this work with minor case / major case system
  is_admin: z.boolean(),
  is_superuser: z.boolean(),
  hunt_has_started: z.boolean(),
  hunt_has_almost_started: z.boolean(),
  hunt_is_over: z.boolean(),
  hunt_is_closed: z.boolean(),
  hunt_solutions_open: z.boolean(),
});

export const context = contextSchema.parse({}); // TODO: get from global vars
