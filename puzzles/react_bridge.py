from puzzles.context import BaseContext


def process_team(context):
    team = {}
    team["team_name"] = context.team.team_name
    team["total_hints_awarded"] = context.team.total_hints_awarded
    team["num_hints_remaining"] = context.team.num_hints_remaining
    team["total_free_answers_awarded"] = context.team.total_free_answers_awarded
    team["num_free_answers_remaining"] = context.team.num_free_answers_remaining
    team["is_prerelease_testsolver"] = context.team.is_prerelease_testsolver
    team["brown_team"] = context.team.brown_team
    team["in_person"] = context.team.in_person

    team["solves"] = context.team.solves_by_case
    team["minor_case_solves"] = context.team.minor_case_solves
    
    team["minor_case_incoming"] = process_incoming_active(context.team.db_minor_case_incoming)
    team["minor_case_active"] = process_incoming_active(context.team.db_minor_case_active)

    # ADD MORE FIELDS HERE IF NEEDED, SEE TEAM MODEL FOR REFERENCE
    # ... you would also need to add them to context.ts in the frontend
    return team

def process_incoming_active(incoming_actives):
  return {
    inc_act.minor_case_round.slug: {
      "name": inc_act.minor_case_round.name,
      "description" : inc_act.minor_case_round.description,
      "major_case_name" : inc_act.minor_case_round.major_case.name,
      "major_case_slug" : inc_act.minor_case_round.major_case.slug,
    }
    for inc_act in incoming_actives.values()
  } 

def process_unlocks(context):
    unlocks = {}
    for puzzle, unlock_time in context.unlocks.items():
        unlocks[puzzle.slug] = {
            "name": puzzle.name,
            "unlock_time": unlock_time,
            "order": puzzle.order,
            "round": puzzle.round.slug,
        }
    return unlocks

def process_rounds(request, context, rounds_raw):
    rounds = {}
    for key, value in rounds_raw.items():
        cur_round = value['round']
        rounds[cur_round.slug] = {
            "name": cur_round.name,
            "order": cur_round.order,
        }
    return rounds

def process_context(request, rounds):
    context = request.context

    react_context = {}
    if context.team:
        react_context["team"] = process_team(context)
    react_context["unlocks"] = process_unlocks(context)
    react_context["rounds"] = process_rounds(request, context, rounds)

    react_context["is_admin"] = context.is_admin
    react_context["is_superuser"] = context.is_superuser

    for name, value in BaseContext.__dict__.items():
        if not name.startswith("__") and not name.isupper():
            react_context[name] = value(context)
        if name == "__dict__":  # do not get anything past BaseContext
            break
    return react_context
