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
      solves: { // THE ONLY IMPORTANT PART BEING MOCKED...
        "social-deduction": {
          "slug1" : {"answer": "Gourd Wilson", puzzle: "socded1", solve_time: "2021-04-10T16:00:00.000Z"},
          "slug2" : {"answer": "MR. EWING KILLSPRINGER", puzzle: "socded2", solve_time: "2021-04-10T16:00:00.000Z"},
          "slug3" : {"answer": "Nick Blocktheway", puzzle: "socded3", solve_time: "2021-04-10T16:00:00.000Z"},
          "slug4" : {"answer": "Transparent J. Eckleburg", puzzle: "socded4", solve_time: "2021-04-10T16:00:00.000Z"},
          "slug5" : {"answer": "Tom Boouchanan", puzzle: "socded5", solve_time: "2021-04-10T16:00:00.000Z"}
        }
      }

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