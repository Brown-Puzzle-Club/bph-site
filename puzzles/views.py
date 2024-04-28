import itertools
import re
from functools import wraps
from urllib.parse import unquote

from django.contrib import messages
from django.db.models import Count
from django.http import Http404
from django.shortcuts import redirect, render
from django.utils.translation import gettext as _
from django.views.decorators.http import require_GET

from puzzles.forms import AnswerHintForm

from puzzles.models import (
    Hint,
    Puzzle,
    Team,
)


def access_restrictor(check_request):
    """
    Creates a decorator that indicates an endpoint that is sometimes hidden to
    all regular users. Superusers are always allowed access. Otherwise, the
    provided check_request function is called on the request first, and if it
    throws an exception or returns a non-None value, that is returned instead.
    """

    def decorator(f):
        @wraps(f)
        def inner(request, *args, **kwargs):
            if not request.context.is_superuser:
                check_res = check_request(request)
                if check_res is not None:
                    return check_res
            return f(request, *args, **kwargs)

        return inner

    return decorator


@access_restrictor
def require_admin(request):
    return redirect("/")


@require_GET  # type: ignore
@require_admin
def hint_list(request):
    """For admins. By default, list popular and outstanding hint requests.
    With query options, list hints satisfying some query."""

    if "team" in request.GET or "puzzle" in request.GET:
        hints = Hint.objects.select_related().order_by("-submitted_datetime")
        query_description = _("Hints")
        if "team" in request.GET:
            team = Team.objects.get(id=request.GET["team"])
            hints = hints.filter(team=team)
            query_description += _(" from {}").format(team.team_name)
        if "puzzle" in request.GET:
            puzzle = Puzzle.objects.get(id=request.GET["puzzle"])
            hints = hints.filter(puzzle=puzzle)
            query_description += _(" on {}").format(puzzle.name)
        return render(
            request,
            "hint_list_query.html",
            {
                "query_description": query_description,
                "hints": hints,
            },
        )
    else:
        unanswered = (
            Hint.objects.select_related()
            .filter(status=Hint.NO_RESPONSE)
            .order_by("submitted_datetime")
        )
        popular = list(
            Hint.objects.values("puzzle_id")
            .annotate(count=Count("team_id", distinct=True))
            .order_by("-count")
        )
        claimers = list(
            Hint.objects.values("claimer").annotate(count=Count("*")).order_by("-count")
        )
        puzzles = {puzzle.id: puzzle for puzzle in request.context.all_puzzles}
        for aggregate in popular:
            aggregate["puzzle"] = puzzles[aggregate["puzzle_id"]]
        return render(
            request,
            "hint_list.html",
            {
                "unanswered": unanswered,
                "stats": itertools.zip_longest(popular, claimers),
            },
        )


@require_admin
def hint(request, id):
    """For admins. Handle a particular hint."""

    hint = Hint.objects.select_related().filter(id=id).first()
    if not hint:
        raise Http404
    form = AnswerHintForm(instance=hint)
    form.cleaned_data = {}

    if request.method == "POST" and request.POST.get("action") == "unclaim":
        if hint.status == Hint.NO_RESPONSE:
            hint.claimed_datetime = None
            hint.claimer = ""
            hint.save()
            messages.warning(request, _("Unclaimed."))
        return redirect("hint-list")
    elif request.method == "POST":
        form = AnswerHintForm(request.POST)
        if hint.status != request.POST.get("initial_status"):
            form.add_error(
                None,
                _(
                    "Oh no! The status of this hint changed. "
                    "Likely either someone else answered it, or the team solved "
                    "the puzzle. You may wish to copy your text and reload."
                ),
            )
        elif form.is_valid():
            hint.answered_datetime = request.context.now
            hint.status = form.cleaned_data["status"]
            hint.response = form.cleaned_data["response"]
            hint.save(update_fields=("answered_datetime", "status", "response"))
            messages.success(request, _("Hint saved."))
            return 
        ("hint-list")

    claimer = request.COOKIES.get("claimer")
    if claimer:
        claimer = re.sub(r"#\d+$", "", unquote(claimer))
    if hint.status != Hint.NO_RESPONSE:
        if hint.claimer:
            form.add_error(
                None, _("This hint has been answered by {}!").format(hint.claimer)
            )
        else:
            form.add_error(None, _("This hint has been answered!"))
    elif hint.claimed_datetime:
        if hint.claimer != claimer:
            if hint.claimer:
                form.add_error(
                    None,
                    _("This hint is currently claimed by {}!").format(hint.claimer),
                )
            else:
                form.add_error(None, _("This hint is currently claimed!"))
    elif request.GET.get("claim"):
        if claimer:
            hint.claimed_datetime = request.context.now
            hint.claimer = claimer
            hint.save()
            messages.success(request, _("You have claimed this hint!"))
        else:
            messages.error(
                request,
                _(
                    "Please set your name before claiming hints! "
                    "(If you just set your name, you can refresh or click Claim.)"
                ),
            )

    limit = request.META.get("QUERY_STRING", "")
    limit = int(limit) if limit.isdigit() else 20
    previous_same_team = (
        Hint.objects.select_related()
        .filter(
            team=hint.team,
            puzzle=hint.puzzle,
            status__in=(Hint.ANSWERED, Hint.REFUNDED),
        )
        .exclude(id=hint.id)  # type: ignore
        .order_by("answered_datetime")
    )
    previous_all_teams = (
        Hint.objects.select_related()
        .filter(puzzle=hint.puzzle, status__in=(Hint.ANSWERED, Hint.REFUNDED))
        .exclude(team=hint.team)
        .order_by("-answered_datetime")
    )[:limit]
    form["status"].field.widget.is_followup = hint.is_followup  # type: ignore
    request.context.puzzle = hint.puzzle
    return render(
        request,
        "hint.html",
        {
            "hint": hint,
            "previous_same_team": previous_same_team,
            "previous_all_teams": previous_all_teams,
            "form": form,
        },
    )
