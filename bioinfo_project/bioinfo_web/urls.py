from django.urls import path
from django.conf.urls.static import static
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name='home'),
    path('blast/', views.blast, name='blast'),
    path('blast/dados/', views.get_dados_amostra, name='dados'),
    path('blast/resultado', views.resultado_blast, name='resultado_blast'),
    path('download/', views.download, name='download'),
    path('sobre/', views.sobre, name="sobre"),
    path('jbrowse/', views.jbrowse, name="jbrowse"),
    path('arvore/', views.arvore, name='arvore')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
