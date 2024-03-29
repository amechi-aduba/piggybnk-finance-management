from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.db import IntegrityError
from .forms import RegistrationForm, LoginForm
from .ai import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Transaction
from django.http import JsonResponse
from .forms import TransactionForm


client = OpenAI(api_key='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')

class FinanceManagementView(TemplateView):
    template_name = 'finance_management.html'

def home(request):
    return render(request, 'finance_management.html', {})

@login_required
def finances(request):
    transactions = Transaction.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'finances.html', {})
@login_required
def planner(request):
    return render(request, 'planner.html', {})

@login_required
def assistant(request):
    return render(request, 'assistant.html', {})

@csrf_exempt  # Temporarily disable CSRF for this view. Better to handle CSRF in your AJAX request.
def save_transaction(request):
    if request.method == 'POST':
        form = TransactionForm(request.POST)
        if form.is_valid():
            transaction = form.save(commit=False)
            transaction.user = request.user
            transaction.save()
            return JsonResponse({'status': 'success', 'message': 'Transaction saved successfully.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid transaction data'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def about(request):
    return render(request, 'about.html', {})

def login_page(request):
    if request.method == 'POST':
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('finance_management')
            else:
                form.add_error('username', 'Invalid username or password')
    else:
        form = LoginForm()
        return render(request, 'login.html', {'form': form})

def registration(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            confirm_password = form.cleaned_data['confirm_password']
            if password == confirm_password:
                try:
                    # Create new user
                    user = User.objects.create_user(
                        username=username,
                        password=password
                    )
                    return redirect('login')
                except IntegrityError:
                    form.add_error('username', 'Username already exists')
            else:
                form.add_error('confirm_password', 'Passwords do not match')
    else:
        form = RegistrationForm()
    return render(request, 'registration.html', {'form': form})