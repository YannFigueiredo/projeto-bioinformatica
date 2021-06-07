from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from django.contrib import messages
from .blast import run_blast
from django.core.files.storage import FileSystemStorage
import os


def home(request):
    return render(request, 'bioinfo_web/home.html')


def download(request):
    return render(request, 'bioinfo_web/download.html')


def sobre(request):
    return render(request, 'bioinfo_web/sobre.html')

def jbrowse(request):
    return render(request, 'bioinfo_web/jbrowse.html')

def arvore(request):
    return render(request, 'bioinfo_web/arvore.html')

def blast(request):
    return render(request, 'bioinfo_web/blast.html')


def resultado_blast(request):
    alinhamentos = run_blast()
    return render(request, 'bioinfo_web/resultado_blast.html',
                  {'alinhamentos': alinhamentos})


def get_dados_amostra(request):
    if request.method == 'POST':
        entrada_textArea = request.POST.get("dados_amostra_textArea")
        if entrada_textArea:
            sequence = request.POST.get("dados_amostra_textArea")
            f = open("bioinfo_web/myfile.fasta", "w")
            f.writelines(sequence)
            f.close()
        else:
            dados_amostra = request.FILES["data"]
            fileStorage = FileSystemStorage()
            if os.path.isfile('bioinfo_web/myfile.fasta'):
                os.remove('bioinfo_web/myfile.fasta')
            fileStorage.save("myfile.fasta", dados_amostra)

    return redirect('resultado_blast')
