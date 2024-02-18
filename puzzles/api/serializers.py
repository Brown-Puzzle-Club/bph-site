from django.contrib.auth.models import User
from puzzles.models import AnswerSubmission, Erratum, ExtraGuessGrant, Hint, MajorCase, MinorCaseActive, MinorCaseIncoming, Puzzle, PuzzleMessage, PuzzleUnlock, RatingField, Round, Survey, Team, TeamMember
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class MajorCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MajorCase
        fields = '__all__'


class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = '__all__'


class PuzzleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Puzzle
        fields = '__all__'


class PuzzleBasicSerializer(serializers.ModelSerializer):
    round = RoundSerializer()
    class Meta:
        model = Puzzle
        fields = ['name', 'slug', 'round', 'order', 'is_meta']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'


class TeamSerializer(serializers.ModelSerializer):
    team_members = TeamMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ('id', 'team_name', 'is_hidden',
                            'is_prerelease_testsolver')


class TeamBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'team_name', 'emoji_choice', 'color_choice', 'in_person', 'is_hidden']


class PuzzleUnlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuzzleUnlock
        fields = '__all__'


class MinorCaseIncomingSerializer(serializers.ModelSerializer):
    minor_case_round = RoundSerializer()
    class Meta:
        model = MinorCaseIncoming
        fields = ['id', 'incoming_datetime', 'minor_case_round']


class MinorCaseActiveSerializer(serializers.ModelSerializer):
    minor_case_round = RoundSerializer()
    class Meta:
        model = MinorCaseActive
        fields = ['id', 'active_datetime', 'minor_case_round']


class AnswerSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerSubmission
        fields = ['id', 'submitted_answer', 'is_correct', 'submitted_datetime', 'used_free_answer']


class ExtraGuessGrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraGuessGrant
        fields = '__all__'


class PuzzleMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuzzleMessage
        fields = '__all__'


class ErratumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Erratum
        fields = '__all__'


class RatingFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingField
        fields = '__all__'


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'


class HintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hint
        fields = '__all__'

class ErrataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Erratum
        fields = '__all__'

# a single context call for all of a team's puzzle and solve progression data
# IMPORTANT NOTE: This serializer contains the frontent context payload, so must be safe for a team to view 
# (all information should be unlocked to the team, not like "all puzzles" or something like that)
class TeamPuzzleContextSerializer(serializers.Serializer):
    is_admin = serializers.BooleanField()
    is_superuser = serializers.BooleanField()
    num_hints_remaining = serializers.IntegerField()
    num_free_answers_remaining = serializers.IntegerField()
    solves_by_case = serializers.DictField(child=serializers.DictField(child=serializers.DictField(child=AnswerSubmissionSerializer())))
    minor_case_solves = serializers.DictField(child=serializers.DictField(child=AnswerSubmissionSerializer()))
    minor_case_incoming = MinorCaseIncomingSerializer(many=True)
    minor_case_active = MinorCaseActiveSerializer(many=True)
    unlocks = serializers.DictField(child=serializers.DateTimeField())


class HuntContextSerializer(serializers.Serializer):
    start_time = serializers.DateTimeField()
    time_since_start = serializers.DurationField()
    end_time = serializers.DateTimeField()
    close_time = serializers.DateTimeField()
    hunt_is_prereleased = serializers.BooleanField()
    hunt_has_started = serializers.BooleanField()
    hunt_is_over = serializers.BooleanField()
    hunt_is_closed = serializers.BooleanField()
    max_guesses_per_puzzle = serializers.IntegerField()
    max_members_per_team = serializers.IntegerField()


class ContextSerializer(serializers.Serializer):
    def to_internal_value(self, data):
        team_context_data = {}
        hunt_context_data = {}

        team_serializer = TeamPuzzleContextSerializer(data=data)
        hunt_serializer = HuntContextSerializer(data=data)

        team_context_fields = [field.source for field in team_serializer.fields.values()]
        hunt_context_fields = [field.source for field in hunt_serializer.fields.values()]
        
        context_fields = dir(data)
        for ctx in context_fields:
            if ctx in hunt_context_fields:
                hunt_context_data[ctx] = hunt_serializer.fields[ctx].get_attribute(data)
            elif ctx in team_context_fields:
                team_context_data[ctx] = team_serializer.fields[ctx].get_attribute(data)

        return {
            'team_context': TeamPuzzleContextSerializer(team_context_data).data,
            'hunt_context': HuntContextSerializer(hunt_context_data).data
        }

