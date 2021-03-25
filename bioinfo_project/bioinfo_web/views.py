from django.shortcuts import render
from django.contrib import messages

def home(request):
    return render(request, 'bioinfo_web/home.html')

def blast(request):
    return render(request, 'bioinfo_web/blast.html')
