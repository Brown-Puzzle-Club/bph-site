from rest_framework import serializers

class TeamMemberSerializer(serializers.Serializer):
    name = serializers.CharField(error_messages={"required": "Member name is required."})
    email = serializers.EmailField(error_messages={"invalid": "Invalid email address."})

class UserRegistrationSerializer(serializers.Serializer):
    team_id = serializers.CharField(min_length=2, error_messages={"min_length": "Team username must be at least 2 characters."})
    team_name = serializers.CharField(error_messages={"required": "Team name is required."})
    password = serializers.CharField(min_length=6, error_messages={"min_length": "Team password must be at least 6 characters."})
    retype_password = serializers.CharField()
    members = TeamMemberSerializer(many=True)
    in_person = serializers.BooleanField()
    num_brown_members = serializers.IntegerField(required=False)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    classroom_need = serializers.BooleanField(required=False)
    where_to_find = serializers.CharField(required=False, allow_blank=True)
    color_choice = serializers.CharField(required=False)
    emoji_choice = serializers.CharField(required=False)

    def validate(self, data):
        if data['password'] != data['retype_password']:
            raise serializers.ValidationError("Passwords do not match.", code="password_mismatch")

        # phone number validation handled on the client side :P .. doing it twice may have disjoint validation rules

        if data['in_person'] and not data.get('classroom_need', True) and data.get('where_to_find', '') == '':
            raise serializers.ValidationError("Required for in person teams that don't need a room reserved.", code="missing_where_to_find")

        return data

class TeamUpdateSerializer(serializers.Serializer):
    in_person = serializers.BooleanField(required=False)
    num_brown_members = serializers.IntegerField(required=False)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    classroom_need = serializers.BooleanField(required=False)
    where_to_find = serializers.CharField(required=False, allow_blank=True)
    color_choice = serializers.CharField(required=False)
    emoji_choice = serializers.CharField(required=False)
    members = TeamMemberSerializer(many=True)

    def validate(self, data):
        if data['in_person'] and not data.get('classroom_need', True) and data.get('where_to_find', '') == '':
            raise serializers.ValidationError("Required for in person teams that don't need a room reserved.", code="missing_where_to_find")

        return data