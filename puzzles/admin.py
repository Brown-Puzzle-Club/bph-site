from django.contrib import admin
from django.urls import reverse
from django import forms
from channels_presence.models import Room, Presence
from puzzles.models import (
    MajorCase,
    MajorCaseCompleted,
    Round,
    Puzzle,
    StorylineUnlock,
    Team,
    TeamMember,
    PuzzleUnlock,
    MinorCaseActive,
    MinorCaseIncomingEvent,
    Event,
    EventCompletion,
    MinorCaseVote,
    MinorCaseVoteEvent,
    MinorCaseCompleted,
    AnswerSubmission,
    ExtraGuessGrant,
    PuzzleMessage,
    Erratum,
    Survey,
    Hint,
    VoiceRecording,
)


class MajorCaseAdmin(admin.ModelAdmin):

    ordering = ("order",)
    list_display = ("name", "slug", "order")


class RoundAdmin(admin.ModelAdmin):

    ordering = ("order",)

    ordering = ("order",)

    list_display = ("name", "slug", "major_case", "meta_answer", "order")


class RoomAdmin(admin.ModelAdmin):
    list_display = ("channel_name",)


class PresenceAdmin(admin.ModelAdmin):
    list_display = ("room", "channel_name", "user", "last_seen")
    list_filter = ("room", "user")


class PuzzleMessageInline(admin.TabularInline):
    model = PuzzleMessage


class PuzzleAdmin(admin.ModelAdmin):

    inlines = [PuzzleMessageInline]
    ordering = ("round__order", "order")
    list_display = (
        "name",
        "slug",
        "round",
        "order",
        "unlock_hours",
        "unlock_global",
        "unlock_local",
        "is_meta",
        "emoji",
    )
    list_filter = ("round", "is_meta")


class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "team")
    list_filter = ("team",)
    search_fields = ("name", "email")


class TeamMemberInline(admin.TabularInline):
    model = TeamMember


class TeamAdmin(admin.ModelAdmin):
    inlines = [TeamMemberInline]

    # You can't sort by this column but meh.
    def is_prerelease_testsolver_short(self, obj):
        return obj.is_prerelease_testsolver

    is_prerelease_testsolver_short.short_description = "Prerel.?"
    is_prerelease_testsolver_short.boolean = True

    ordering = ("team_name",)
    list_display = (
        "team_name",
        "creation_time",
        "is_prerelease_testsolver_short",
        "is_hidden",
        "in_person",
        "brown_team",
        "classroom_need",
    )
    list_filter = ("is_prerelease_testsolver", "is_hidden")
    search_fields = ("team_name",)


class PuzzleUnlockAdmin(admin.ModelAdmin):
    list_display = ("team", "puzzle", "unlock_datetime")
    list_filter = ("puzzle", "puzzle__round", "team")


class MinorCaseIncomingEventAdmin(admin.ModelAdmin):
    list_display = ("team", "timestamp", "expiration", "final_vote")
    list_filter = ("team", "timestamp", "expiration", "final_vote")


class MinorCaseVoteAdmin(admin.ModelAdmin):
    list_display = ("team", "minor_case", "num_votes")
    list_filter = ("minor_case", "team")


class MinorCaseVoteEventAdmin(admin.ModelAdmin):
    list_display = ("team", "timestamp")
    list_filter = ("team", "timestamp")


class MinorCaseActiveAdmin(admin.ModelAdmin):
    list_display = ("team", "minor_case_round", "active_datetime")
    list_filter = ("minor_case_round", "minor_case_round__major_case", "team")


class MinorCaseCompletedAdmin(admin.ModelAdmin):
    list_display = ("team", "minor_case_round", "completed_datetime")
    list_filter = ("minor_case_round", "minor_case_round__major_case", "team")


class MinorCaseCompletedAdmin(admin.ModelAdmin):
    list_display = ("team", "minor_case_round", "completed_datetime")
    list_filter = ("minor_case_round", "minor_case_round__major_case", "team")


class MajorCaseCompletedAdmin(admin.ModelAdmin):
    list_display = ("team", "major_case", "completed_datetime")
    list_filter = ("major_case", "team")


class AnswerSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "team",
        "puzzle",
        "submitted_answer",
        "submitted_datetime",
        "is_correct",
        "used_free_answer",
    )
    list_filter = ("is_correct", "used_free_answer", "puzzle", "puzzle__round", "team")
    search_fields = ("submitted_answer",)


class ExtraGuessGrantAdmin(admin.ModelAdmin):
    list_display = ("team", "puzzle", "extra_guesses")
    list_filter = ("puzzle", "puzzle__round", "team")


class ErratumAdmin(admin.ModelAdmin):
    list_display = ("puzzle", "timestamp", "published")
    list_filter = ("puzzle", "puzzle__round", "published")
    search_fields = ("puzzle", "update_text", "puzzle_text")


class SurveyAdmin(admin.ModelAdmin):
    list_display = ("team", "puzzle", "submitted_datetime")
    list_filter = ("puzzle", "puzzle__round", "team")
    search_fields = ("comments",)


class HintAdmin(admin.ModelAdmin):

    list_display = (
        "team",
        "puzzle",
        "claimer",
        "status",
        "is_followup",
        "submitted_datetime",
        "claimed_datetime",
        "answered_datetime",
    )
    list_filter = ("status", "puzzle", "puzzle__round", "team", "claimer")
    search_fields = ("hint_question", "response")


class VoiceRecordingAdmin(admin.ModelAdmin):
    list_display = ("transcript", "hour", "characters")
    list_filter = ("hour",)
    search_fields = ("transcript", "characters")


class StorylineUnlockAdmin(admin.ModelAdmin):
    list_display = ("team", "storyline", "unlock_datetime")
    list_filter = ("storyline", "team")


class EventAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "timestamp",
        "is_final_runaround",
        "answer",
    )
    list_filter = ("timestamp", "is_final_runaround")


class EventCompletionAdmin(admin.ModelAdmin):
    list_display = ("team", "completion_datetime", "event")
    list_filter = ("team", "completion_datetime")


admin.site.register(MajorCase, MajorCaseAdmin)
admin.site.register(Round, RoundAdmin)
admin.site.register(Puzzle, PuzzleAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(TeamMember, TeamMemberAdmin)
admin.site.register(PuzzleUnlock, PuzzleUnlockAdmin)

admin.site.register(MinorCaseIncomingEvent, MinorCaseIncomingEventAdmin)
admin.site.register(MinorCaseVoteEvent, MinorCaseVoteEventAdmin)
admin.site.register(MinorCaseActive, MinorCaseActiveAdmin)
admin.site.register(MinorCaseCompleted, MinorCaseCompletedAdmin)

admin.site.register(MajorCaseCompleted, MajorCaseCompletedAdmin)

admin.site.register(AnswerSubmission, AnswerSubmissionAdmin)
admin.site.register(ExtraGuessGrant, ExtraGuessGrantAdmin)
admin.site.register(Erratum, ErratumAdmin)
admin.site.register(Survey, SurveyAdmin)
admin.site.register(Hint, HintAdmin)
admin.site.register(Room, RoomAdmin)
admin.site.register(Presence, PresenceAdmin)
admin.site.register(VoiceRecording, VoiceRecordingAdmin)

admin.site.register(StorylineUnlock, StorylineUnlockAdmin)

admin.site.register(Event, EventAdmin)
admin.site.register(EventCompletion, EventCompletionAdmin)
