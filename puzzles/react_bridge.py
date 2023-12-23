from puzzles.context import BaseContext


def process_team(context):
    team = {}
    team["team_name"] = context.team.team_name
    team["total_hints_awarded"] = context.team.total_hints_awarded
    team["num_hints_remaining"] = context.team.num_hints_remaining
    team["total_free_answers_awarded"] = context.team.total_free_answers_awarded
    team["num_free_answers_remaining"] = context.team.num_free_answers_remaining
    team["is_prerelease_testsolver"] = context.team.is_prerelease_testsolver
    team["brown_members"] = context.team.brown_members
    team["in_person"] = context.team.in_person

    team["solves"] = process_solves(context)

    # ADD MORE FIELDS HERE IF NEEDED, SEE TEAM MODEL FOR REFERENCE
    # ... you would also need to add them to context.ts in the frontend
    return team


def process_unlocks(context):
    unlocks = {}
    for puzzle, unlock_time in context.unlocks.items():
        print(puzzle.slug)
        print(unlock_time)
        print(puzzle.order)
        print(puzzle.round.slug)
        unlocks[puzzle.slug] = {
            "name": puzzle.name,
            "unlock_time": unlock_time,
            # "order": puzzle.order,
            # "round": puzzle.round.slug,
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

def process_solves(context):
    return context.team.solves_with_info

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
