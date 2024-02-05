import re

from django import forms
from django.contrib.auth.models import User
from django.core.validators import validate_email, RegexValidator
from django.utils.translation import gettext as _

from puzzles.models import (
    Team,
    TeamMember,
    Survey,
    Hint,
)


def looks_spammy(s):
    return re.search('https?://', s, re.IGNORECASE) is not None

class RegisterForm(forms.Form):
    team_id = forms.CharField(
        label=_('Team Username'),
        max_length=100,
        help_text=(
            _('This is the private username your team will use when logging in. '
            'It should be short and not contain special characters.')
        ),
    )
    team_name = forms.CharField(
        label=_('Team Name'),
        max_length=200,
        help_text=(
            _('This is how your team name will appear on the public leaderboard.')
        ),
    )
    password = forms.CharField(
        label=_('Team Password'),
        widget=forms.PasswordInput,
        help_text=_('You’ll probably share this with your team.'),
    )
    password2 = forms.CharField(
        label=_('Retype Password'),
        widget=forms.PasswordInput,
    )

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        team_id = cleaned_data.get('team_id')
        password = cleaned_data.get('password')
        password2 = cleaned_data.get('password2')
        team_name = cleaned_data.get('team_name')

        if looks_spammy(team_name):
            raise forms.ValidationError(
                _('That public team name isn’t allowed.')
            )

        if password != password2:
            raise forms.ValidationError(
                _('Passwords don’t match.')
            )

        if User.objects.filter(username=team_id).exists():
            raise forms.ValidationError(
                _('That login username has already been taken by a different '
                'team.')
            )

        if Team.objects.filter(team_name=team_name).exists():
            raise forms.ValidationError(
                _('That public team name has already been taken by a different '
                'team.')
            )

        return cleaned_data


def validate_team_member_email_unique(email):
    if TeamMember.objects.filter(email=email).exists():
        raise forms.ValidationError(
            _('Someone with that email is already registered as a member on a '
            'different team.')
        )

class TeamMemberForm(forms.Form):
    name = forms.CharField(label=_('Name (required)'), max_length=200)
    email = forms.EmailField(
        label=_('Email (optional)'),
        max_length=200,
        required=False,
        validators=[validate_email, validate_team_member_email_unique],
    )

class LogisticsForm(forms.Form):
    brown_members = forms.BooleanField(label=_('Do you have any Brown/RISD community members on your team?'), help_text=_('(Undergraduates, Graduates, Faculty, or Alumni)'), required=False)
    brown_affiliation_desc = forms.CharField(label=_('For each member, please describe their affiliation to Brown/RISD (if applicable)'), max_length=200, required=False)
    in_person_sat = forms.CharField(label=_('How many of your team members will be attending the event in person on Saturday, April 15th?'), required=True)
    in_person_sun = forms.CharField(label=_('How many of your team members will be attending the event in person on Sunday, April 16th?'), required=True)
    # classroom_need = forms.BooleanField(label=_('Do you want to request a classroom to hunt in?'),help_text=_('Our availability will be limited, so please do not request one if you can make alternate plans.'), required=False)
    where_to_find = forms.CharField(label=_("Where can we best find you during the hunt while you're solving puzzles?"), help_text=_('(e.g: Hegeman Common Room, Barus and Holley Room ###, Zoom, Discord, etc.)'), max_length=200)
    # phone_regex = RegexValidator(regex=r'^[0-9\.-]$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = forms.CharField(label=_('Phone number of your team captain'), help_text=_('Required for teams with on-site presence. If the team captain is not on-site, the phone number of whoever you trust most who is. Please don`t include country code (+#).. we cannot service international numbers.'), max_length=16, required=False)

    def clean(self):
        cleaned_data = super(LogisticsForm, self).clean()
        brown_members = cleaned_data.get('brown_members')
        brown_affiliation_desc = cleaned_data.get('brown_affiliation_desc')
        in_person_sat = cleaned_data.get('in_person_sat')
        in_person_sun = cleaned_data.get('in_person_sun')
        #classroom_need = cleaned_data.get('classroom_need')
        where_to_find = cleaned_data.get('where_to_find')
        phone_number = cleaned_data.get('phone_number')

        if not in_person_sat.isdigit():
            raise forms.ValidationError(
                _('Please enter a valid number of people for Saturday.')
            )
        if not in_person_sun.isdigit():
            raise forms.ValidationError(
                _('Please enter a valid number of people for Sunday.')
            )

        if re.match('^[0-9\.-]*$', phone_number) is None:
            raise forms.ValidationError(
                _('Please enter a valid phone number.')
            )

        return cleaned_data

class TeamMergeForm(forms.Form):
    merge_out = forms.BooleanField(label=_('Would you be interested in joining up with a larger team for the hunt?'), required=False)
    merge_out_preferences = forms.CharField(label=_('If applicable, please detail your preferences for the team you would like to join'), help_text=_('(e.g. size, age-range, in-person vs remote, etc.). We will try our best to accomodate everyone to their prefrences.'), max_length=200, required=False)
    merge_in = forms.BooleanField(label=_('Would you be interested in taking on lone-solvers onto your team?'), required=False)
    merge_in_preferences = forms.CharField(label=_('If applicable, please detail your preferences for the lone-solvers you would like to take on'), help_text=_('(e.g. number of new members, age-range, in-person vs remote, etc.). We will not add more members to your team than you prefer.'), max_length=200, required=False)

    def clean(self):
        cleaned_data = super(TeamMergeForm, self).clean()

        # may need more validation later
        return cleaned_data

def validate_team_emails(formset):
    emails = []
    for form in formset.forms:
        name = form.cleaned_data.get('name')
        if not name:
            raise forms.ValidationError(_('All team members must have names.'))
        if looks_spammy(name):
            raise forms.ValidationError(_('That team member name isn’t allowed.'))
        email = form.cleaned_data.get('email')
        if email:
            emails.append(email)
    if not emails:
        raise forms.ValidationError(_('You must list at least one email address.'))
    if len(emails) != len(set(emails)):
        raise forms.ValidationError(_('All team members must have unique emails.'))
    return emails

class TeamMemberFormset(forms.BaseFormSet):
    def clean(self):
        if any(self.errors):
            return
        validate_team_emails(self)

class TeamMemberModelFormset(forms.models.BaseModelFormSet):
    def clean(self):
        if any(self.errors):
            return
        emails = validate_team_emails(self)
        if (
            TeamMember.objects
            .exclude(team=self.data['team'])
            .filter(email__in=emails)
            .exists()
        ):
            raise forms.ValidationError(
                _('One of the emails you listed is already on a different team.')
            )


class SubmitAnswerForm(forms.Form):
    answer = forms.CharField(
        label=_('Enter your guess:'),
        max_length=500,
        widget=forms.TextInput(attrs={'autofocus': True}),
    )


class RequestHintForm(forms.Form):
    hint_question = forms.CharField(
        label=(
            _('Describe everything you’ve tried on this puzzle. We will '
            'provide a hint to help you move forward. The more detail you '
            'provide, the less likely it is that we’ll tell you '
            'something you already know.')
        ),
        widget=forms.Textarea,
    )

    def __init__(self, team, *args, **kwargs):
        super(RequestHintForm, self).__init__(*args, **kwargs)
        notif_choices = [('all', _('Everyone')), ('none', _('No one'))]
        notif_choices.extend(team.get_emails(with_names=True))
        self.fields['notify_emails'] = forms.ChoiceField(
            label=_('When the hint is answered, send an email to:'),
            choices=notif_choices
        )


class HintStatusWidget(forms.Select):
    def get_context(self, name, value, attrs):
        self.choices = []
        for (option, desc) in Hint.STATUSES:
            if option == Hint.NO_RESPONSE:
                if value != Hint.NO_RESPONSE: continue
            elif option == Hint.ANSWERED:
                if value == Hint.OBSOLETE: continue
                if self.is_followup:
                    desc += _(' (as followup)')
            elif option == Hint.REFUNDED:
                if value == Hint.OBSOLETE: continue
                if self.is_followup:
                    desc += _(' (thread closed)')
            elif option == Hint.OBSOLETE:
                if value != Hint.OBSOLETE: continue
            self.choices.append((option, desc))
        if value == Hint.NO_RESPONSE:
            value = Hint.ANSWERED
            attrs['style'] = 'background-color: #ff3'
        return super(HintStatusWidget, self).get_context(name, value, attrs)

class AnswerHintForm(forms.ModelForm):
    class Meta:
        model = Hint
        fields = ('response', 'status')
        widgets = {'status': HintStatusWidget}


class SurveyForm(forms.ModelForm):
    class Meta:
        model = Survey
        exclude = ('team', 'puzzle', 'submitted_datetime')


# This form is a customization of forms.PasswordResetForm
class PasswordResetForm(forms.Form):
    team_id = forms.CharField(label=_('Team Username'), max_length=100)

    def clean(self):
        cleaned_data = super(PasswordResetForm, self).clean()
        team_id = cleaned_data.get('team_id')
        team = Team.objects.filter(user__username=team_id).first()
        if team is None:
            raise forms.ValidationError(_('That username doesn’t exist.'))
        cleaned_data['team'] = team
        return cleaned_data
