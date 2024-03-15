from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

class FinanceManagementView(TemplateView):
    template_name = 'finance_management.html'

def home(request):
    return render(request, 'finance_management.html', {})

@login_required
def finances(request):
    return render(request, 'finances.html', {})

@login_required
def planner(request):
    return render(request, 'planner.html', {})

@login_required
def assistant(request):
    return render(request, 'assistant.html', {})

def about(request):
    return render(request, 'about.html', {})

def login_page(request):
    return render(request, 'login.html', {})

def registration(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'registration.html', {'form': form})