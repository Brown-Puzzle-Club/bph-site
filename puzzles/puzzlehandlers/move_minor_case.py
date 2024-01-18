import traceback
import json
from django.views.decorators.http import require_POST
from puzzles.models import MinorCaseIncoming, MinorCaseActive, MinorCaseCompleted

from django.http import HttpResponse

@require_POST
def move_minor_case(request, team_id, round_id):
    "move minor case state"
    print("attempted to move minor case")
    try:
        incoming_case = MinorCaseIncoming.objects.get(team_id=team_id, minor_case_round_id=round_id)
    except MinorCaseIncoming.DoesNotExist:
        return {'error': 'MinorCaseIncoming not found'}

    active_case = MinorCaseActive(
        team=incoming_case.team,
        minor_case_round=incoming_case.minor_case_round,
        active_datetime=incoming_case.incoming_datetime,
    )

    active_case.save()

    return {'success': 'Move operation successful'}

