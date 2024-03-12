from django.shortcuts import render

# Create your views here:
def home(request):
    return render(request, 'pages/finance_management.html', {})

def finances(request):
    return render(request, 'pages/finances.html', {})

def finance_management(request):
    return render(request, 'pages/finance_management.html', {})

def planner(request):
    return render(request, 'pages/planner.html', {})

def assistant(request):
    return render(request, 'pages/assistant.html', {})

def about(request):
    return render(request,'pages/about.html', {})
