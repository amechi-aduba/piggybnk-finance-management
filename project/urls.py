"""
URL configuration for finance_mgmt project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from finance_app.views import *

urlpatterns = [
    path('', home, name="home"),
    path('admin/', admin.site.urls),
    path('finance_app/', include('finance_app.urls', namespace='finance_app')),  # Adjusted to include the app prefix 'finance_app/'
    path('finances/', finances, name='finances'),
    path('finance_app/get_openai_response/', get_openai_response, name='get_openai_response'),
    path('login/', login_page, name="login"),
    path('registration/', registration, name="registration"),
    path('save-transaction/', save_transaction, name="save_transaction"),
    path('finance_app/about/', about, name="about"),
    # Include other apps' URLs as needed.
] 

if settings.DEBUG:
   urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)