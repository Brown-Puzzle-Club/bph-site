export const MOCK_CONTEXTS: Record<string, unknown> = {
  'social-deduction': {
    team: {
      team_name: "breadpeople",
      total_hints_awarded: 2,
      num_hints_remaining: 1,
      total_free_answers_awarded: 1,
      num_free_answers_remaining: 0,
      is_prerelease_testsolver: false,
      brown_members: true,
      in_person: false,
      solves: {},
      minor_case_solves: { // THE ONLY IMPORTANT PART BEING MOCKED...
        "social-deduction": {
          "sd-mc-1" : {"answer": "Gourd Wilson", minor_case: "socded1", solve_time: "2021-04-10T16:00:00.000Z"},
          "sd-mc-2" : {"answer": "MR. EWING KILLSPRINGER", minor_case: "socded2", solve_time: "2021-04-10T16:00:00.000Z"},
          "sd-mc-3" : {"answer": "Nick Blocktheway", minor_case: "socded3", solve_time: "2021-04-10T16:00:00.000Z"},
          "sd-mc-4" : {"answer": "Transparent J. Eckleburg", minor_case: "socded4", solve_time: "2021-04-10T16:00:00.000Z"},
          // "sd-mc-5" : {"answer": "Tom Boouchanan", minor_case: "socded5", solve_time: "2021-04-10T16:00:00.000Z"}
        }
      },
      minor_case_incoming: {},
      minor_case_active: {},
    },
    unlocks: {},
    rounds: {
      "social-deduction": {
        name: "Social Deduction",
        order: 1,
      }
    },
    is_admin: false,
    is_superuser: false,
    now: "2021-04-10T16:00:00.000Z",
    start_time: "2021-04-10T16:00:00.000Z",
    time_since_start: "2021-04-10T16:00:00.000Z",
    end_time: "2021-04-10T16:00:00.000Z",
    close_time: "2021-04-10T16:00:00.000Z",
    solution_time: "2021-04-10T16:00:00.000Z",
    hunt_is_prereleased: false,
    hunt_has_started: true,
    hunt_has_almost_started: false,
    hunt_is_over: false,
    hunt_is_closed: false,
    hunt_solutions_open: false,
    num_metas: 1,
  }
  // TODO: add more mock contexts here (use the endpoint of the page you are working on!)
}