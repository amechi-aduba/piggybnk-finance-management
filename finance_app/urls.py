from . import views
from django.urls import path, include
from django.contrib.auth.views import LoginView

app_name = 'finance_app'

urlpatterns = [
    path('', views.home, name="home"),  # Accessible at /finance_app/
    path('finances/', views.finances, name="finances"),
    path('planner/', views.planner, name="planner"),
    path('assistant/', views.assistant, name="assistant"),
    path('finances/', views.finances, name='finances'),
    path('finance_app/about/', views.about, name="about"),
    path('login/', views.login_page, name="login"),
    path('registration/', views.registration, name="registration"),
    path('save-transaction/', views.save_transaction, name="save_transaction"),
    path('finance_app/get_openai_response/', views.get_openai_response, name='get_openai_response')
]