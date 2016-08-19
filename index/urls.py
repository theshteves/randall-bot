from django.conf.urls import url
from . import views

app_name = "index"

urlpatterns = [
    url(r'^spawn', views.spawn, name="spawn"),
    url(r'^', views.index, name="index"),
]

