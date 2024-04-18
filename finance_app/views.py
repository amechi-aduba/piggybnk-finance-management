from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.db import IntegrityError
from .forms import RegistrationForm, LoginForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Transaction
from .forms import TransactionForm
import os
import ollama
from django.views.decorators.csrf import csrf_exempt
import traceback
import json
import openai


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


@csrf_exempt  # Temporarily disable CSRF for this view. Better to handle CSRF in your AJAX request.
def save_transaction(request):
    if request.method == "POST":
        form = TransactionForm(request.POST)
        if form.is_valid():
            transaction = form.save(commit=False)
            transaction.user = request.user
            transaction.save()
            return JsonResponse(
                {"status": "success", "message": "Transaction saved successfully."}
            )
        else:
            return JsonResponse(
                {"status": "error", "message": "Invalid transaction data"}
            )
    return JsonResponse({"status": "error", "message": "Invalid request"})


def about(request):
    return render(request, "about.html", {})


def login_page(request):
    if request.method == "POST":
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("finance_management")
            else:
                form.add_error("username", "Invalid username or password")
    else:
        form = LoginForm()
        return render(request, "login.html", {"form": form})


def registration(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            confirm_password = form.cleaned_data["confirm_password"]
            if password == confirm_password:
                try:
                    # Create new user
                    user = User.objects.create_user(
                        username=username, password=password
                    )
                    return redirect("login")
                except IntegrityError:
                    form.add_error("username", "Username already exists")
            else:
                form.add_error("confirm_password", "Passwords do not match")
    else:
        form = RegistrationForm()
    return render(request, "registration.html", {"form": form})

@csrf_exempt
def financial_advisor_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_question = data['user_question']
            response = ollama.chat(
                model='codellama:7b-instruct',
                messages=[
                    {'role': 'user', 'content': user_question},
                    {'role': 'system', 'content': 'You are a financial advisor for Piggybnk...'},
                ]
            )
            return JsonResponse({'advice': 'Your response'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'Missing user_question field'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

#change line to regular api key if not in virtual environment
openai.api_key = os.getenv("sk-proj-ywkQ12CmAv5IwuPQd0s6T3BlbkFJplvV41CSC3zQ5kI3nh6P")

def some_view(request):
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        return JsonResponse({'error': 'API key is not set'}, status=500)

@csrf_exempt
def get_openai_response(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_input = data.get("userText", "")

            prompt = f"""
            You are a financial advisor for a finance management website named Piggybnk. 
            You give advice to users that have questions about their purchases and you should 
            have access to any of their data uploaded on the finances section of the site.

            User: {user_input}
            Financial Advisor:
            """

            if not openai.api_key:
                return JsonResponse({"error": "The OpenAI API key has not been set."}, status=500)

            response = openai.Completion.create(
                engine="davinci",
                prompt=prompt,
                max_tokens=150
            )

            # Assuming the API response structure, adjust if needed
            advisor_response = response.choices[0].text.strip() if response.choices else "No response received."

            return JsonResponse({"response": advisor_response})
        except Exception as e:
            traceback.print_exc()  # This will print the stack trace to the console, which is very useful for debugging
            return JsonResponse({"error": "An error occurred while processing your request."}, status=500)
    else:
        return JsonResponse({"error": "This endpoint only supports POST requests."}, status=400)