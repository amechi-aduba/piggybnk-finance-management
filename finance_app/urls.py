from . import views
from django.urls import path
from finance_app import pages

urlpatterns = [
    path("", pages.home, name='finance_management'),
    path("finances/", pages.finances, name='finances'),
    path("planner/", pages.planner, name='planner'),
    path("assistant/", pages.assistant, name='assistant'),
    path("about/", pages.about, name='about'),
]
