# finance_app/pages.py

from django.shortcuts import render

def home(request):
    return render(request, 'finance_management.html')

def finances(request):
    return render(request, 'finances.html')

def planner(request):
    return render(request, 'planner.html')

def assistant(request):
    return render(request, 'assistant.html')

def about(request):
    return render(request, 'about.html')
