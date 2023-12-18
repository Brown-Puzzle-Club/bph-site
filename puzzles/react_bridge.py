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

    # ADD MORE FIELDS HERE IF NEEDED, SEE TEAM MODEL FOR REFERENCE
    # ... you would also need to add them to context.ts in the frontend
    return team


def process_unlocks(context):
    unlocks = {}
    for key, value in context.unlocks.items():
        unlocks[key] = value.isoformat()
    return unlocks


def process_rounds(request, context, rounds_raw):
    rounds = {}
    for key, value in rounds_raw.items():
        rounds[key] = value.isoformat()
    return rounds


def process_context(request, rounds):
    context = request.context

    react_context = {}
    if context.team:
        react_context["team"] = process_team(context)
    react_context["unlocks"] = process_unlocks(context)
    react_context["rounds"] = process_rounds(request, context, rounds)

    print(react_context['rounds'])

    react_context["is_admin"] = context.is_admin
    react_context["is_superuser"] = context.is_superuser

    for name, value in BaseContext.__dict__.items():
        if not name.startswith("__") and not name.isupper():
            react_context[name] = value(context)
        if name == "__dict__":  # do not get anything past BaseContext
            break

    return react_context
