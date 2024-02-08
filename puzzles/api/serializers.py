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
        fields = ['id', 'team_name', 'emoji_choice', 'color_choice']


class PuzzleUnlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuzzleUnlock
        fields = '__all__'


class MinorCaseIncomingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MinorCaseIncoming
        fields = '__all__'


class MinorCaseActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = MinorCaseActive
        fields = '__all__'


class AnswerSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerSubmission
        fields = '__all__'


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