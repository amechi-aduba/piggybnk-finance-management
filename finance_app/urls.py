from . import views
from django.urls import path, include
from django.contrib.auth.views import LoginView

urlpatterns = [
    path("", views.FinanceManagementView.as_view(), name="finance_management"),
    path("finances/", views.finances, name="finances"),
    path("planner/", views.planner, name="planner"),
    path("assistant/", views.assistant, name="assistant"),
    path("about/", views.about, name="about"),
    path("login/", LoginView.as_view(template_name="login.html"), name="login"),
    path("registration/", views.registration, name="registration"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("save-transaction/", views.save_transaction, name="save_transaction"),
    path('financial-advice/', views.get_openai_response, name='financial_advice'),
]
