import { z } from "zod";
import { MOCK_CONTEXTS } from "./mock/mockContexts";

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
      solves: z.record(z.record(z.object({
        puzzle: z.string(),
        solve_time: z.string().transform((x) => new Date(x)),
        answer: z.string(),
      })))
    })
    .optional(),
  unlocks: z.record(z.object({
    name: z.string(),
    unlock_time: z.string().transform((x) => new Date(x)),
    order: z.number().int(),
    round: z.string(),
  })),
  rounds: z.record(z.object({
    name: z.string(),
    order: z.number().int(),
  })),
  // TODO: make this work with minor case / major case system
  // TODO: also add events as separate.

  // nice-to-have extras from Context
  is_admin: z.boolean(),
  is_superuser: z.boolean(),

  // all from BaseContext
  now: z.string().transform((x) => new Date(x)),
  start_time: z.string().transform((x) => new Date(x)),
  time_since_start: z.string().transform((x) => new Date(x)),
  end_time: z.string().transform((x) => new Date(x)),
  close_time: z.string().transform((x) => new Date(x)),
  solution_time: z.string().transform((x) => new Date(x)),
  hunt_is_prereleased: z.boolean(),
  hunt_has_started: z.boolean(),
  hunt_has_almost_started: z.boolean(),
  hunt_is_over: z.boolean(),
  hunt_is_closed: z.boolean(),
  hunt_solutions_open: z.boolean(),
  num_metas: z.number().int(),
});


function mockContext() {
  const currentUrl = window.location.href;
  // part of endpoint past brownpuzzlehunt.com/
  const path = currentUrl.split("/").slice(3).join("/");

  return (path in MOCK_CONTEXTS) ? MOCK_CONTEXTS[path] : {};
}


let context: unknown | undefined;
try {
  // @ts-expect-error djangoContext is defined in the template html
  context = contextSchema.parse(JSON.parse(djangoContext));
} catch (error) {
  context = mockContext();
}

export { context };
