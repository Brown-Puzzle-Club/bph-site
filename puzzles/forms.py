from django import forms
from django.utils.translation import gettext as _

from puzzles.models import Hint


class HintStatusWidget(forms.Select):
    def get_context(self, name, value, attrs):
        self.choices = []
        for option, desc in Hint.STATUSES:
            if option == Hint.NO_RESPONSE:
                if value != Hint.NO_RESPONSE:
                    continue
            elif option == Hint.ANSWERED:
                if value == Hint.OBSOLETE:
                    continue
                if self.is_followup:  # type: ignore
                    desc += _(" (as followup)")
            elif option == Hint.REFUNDED:
                if value == Hint.OBSOLETE:
                    continue
                if self.is_followup:  # type: ignore
                    desc += _(" (thread closed)")
            elif option == Hint.OBSOLETE:
                if value != Hint.OBSOLETE:
                    continue
            self.choices.append((option, desc))  # type: ignore
        if value == Hint.NO_RESPONSE:
            value = Hint.ANSWERED
            attrs["style"] = "background-color: #ff3"  # type: ignore
        return super(HintStatusWidget, self).get_context(name, value, attrs)


class AnswerHintForm(forms.ModelForm):
    class Meta:
        model = Hint
        fields = ("response", "status")
        widgets = {"status": HintStatusWidget}
