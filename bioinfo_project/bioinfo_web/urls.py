from django.urls import path
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('blast/', views.blast, name='blast'),
    path('blast/dados/', views.get_dados_amostra, name='dados'),
]
