from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from django.contrib import messages
from .blast import main


def home(request):
    return render(request, 'bioinfo_web/home.html')

def blast(request):
    return render(request, 'bioinfo_web/blast.html')

def get_dados_amostra(request):
    if request.method == 'POST':
        sequence = request.POST.get("sample_data")
        f = open("bioinfo_web/myfile.fasta", "w")
        f.writelines(sequence)
        f.close()
    main()
    return HttpResponse('certo')
