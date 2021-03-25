from django.shortcuts import render
from django.contrib import messages

def home(request):
    return render(request, 'bioinfo_web/home.html')
