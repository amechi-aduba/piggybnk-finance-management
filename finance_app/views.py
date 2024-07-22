from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.db import IntegrityError
from .forms import RegistrationForm, LoginForm, TransactionForm
from .models import Transaction
from django.contrib import messages
import os
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import openai
from decouple import config


def index(request):
    return render(request, "index.html")

class FinanceManagementView(TemplateView):
    template_name = "finance_management.html"

def home(request):
    return render(request, "finance_management.html", {})

@login_required
def finances(request):
    transactions = Transaction.objects.filter(user=request.user).order_by("-created_at")
    return render(request, "finances.html", {})

@login_required
def planner(request):
    return render(request, "planner.html", {})

@login_required
def assistant(request):
    return render(request, "assistant.html", {})




api_key = config('API_KEY')

import logging

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["POST"])
def get_openai_response(request):
    try:
        data = json.loads(request.body)
        user_input = data.get("userText", "")

        if not user_input:
            return JsonResponse({"error": "No user input provided"}, status=400)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}]
        )

        message = response.get("choices")[0].get("message").get("content") if response.get("choices") else None

        if message:
            return JsonResponse({"advice": message})
        else:
            return JsonResponse({"error": "No response from AI"}, status=500)

    except Exception as e:
        return JsonResponse({"error": f"Server Error: {str(e)}"}, status=500)


def about(request):
    return render(request, "about.html", {})

def login_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('finance_app:home')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'login.html')

def registration(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            confirm_password = form.cleaned_data["confirm_password"]
            if password == confirm_password:
                try:
                    user = User.objects.create_user(username=username, password=password)
                    return redirect("login")
                except IntegrityError:
                    form.add_error("username", "Username already exists")
            else:
                form.add_error("confirm_password", "Passwords do not match")
    else:
        form = RegistrationForm()
    return render(request, "registration.html", {"form": form})

@csrf_exempt
def save_transaction(request):
    if request.method == "POST":
        form = TransactionForm(request.POST)
        if form.is_valid():
            transaction = form.save(commit=False)
            transaction.user = request.user
            transaction.save()
            return JsonResponse({"status": "success", "message": "Transaction saved successfully."})
        else:
            return JsonResponse({"status": "error", "message": "Invalid transaction data"})
    return JsonResponse({"status": "error", "message": "Invalid request"})

    # Modify the view that handles the endpoint
def financial_advice(request):
    try:
        data = json.loads(request.body)
        user_input = data['userText']  # Make sure you are accessing the correct key
        # Process the user_input to generate a response
        return JsonResponse({"advice": "Generated response"})
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except KeyError:
        return JsonResponse({"error": "Malformed data, missing 'userText'"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)