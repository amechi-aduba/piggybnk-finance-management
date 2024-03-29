from django import forms
from .models import *

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

class RegistrationForm(forms.Form):
    username=forms.CharField()
    password=forms.CharField(widget=forms.PasswordInput)
    confirm_password=forms.CharField(widget=forms.PasswordInput)

class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['transaction_name', 'transaction_amount', 'reimbursement_name', 'reimbursement_amount']