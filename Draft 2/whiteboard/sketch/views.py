import random
from django.shortcuts import render
from django.core.context_processors import csrf
from django.http import HttpResponse, HttpResponseRedirect
from sketch.models import Project, Sketch, Bridge
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth import logout
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required
import datetime
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.mail import send_mail, BadHeaderError
from django.template import RequestContext, Context

# Create your views here.

@csrf_exempt
def project(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('sketch/project.html', {})


@csrf_exempt
@login_required(login_url="/sketch/login/")
def sketch(request, project_id, sketch_id):
    c = {}
    c.update(csrf(request))

    return render_to_response('sketch/sketch.html',
                              {'project_id': project_id, 'sketch_id': sketch_id, 'user_id': request.user.username})


@csrf_exempt
@login_required(login_url="/sketch/login/")
def add_project(request):
    p = Project(name=request.POST['projectName'])
    p.save()

    tempName = request.user.username;
    s = Sketch(project=p,
               clickMap=json.dumps({tempName: [[], [], [], []]}))
    s.save()

    b = Bridge(user=request.user,
               project=p)
    b.save()

    temp = p.name + "_" + str(p.id)

    return HttpResponseRedirect(reverse('sketch', kwargs={'project_id': temp, 'sketch_id': str(s.id)}))


@csrf_exempt
def index(request):
    c = {}
    c.update(csrf(request))
    see="haha"
    print request.user
    print request.user.username
    return render_to_response('sketch/index.html', {'see':see})


def login(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('sketch/login.html', c)

def contact(request):
    return render_to_response('sketch/contact.html', {})

@csrf_exempt    
def contactform(request):
    name = request.POST.get('username', '')
    email = request.POST.get('email', '')
    comment = request.POST.get('comment', '')
    if name and email and comment:
        send_mail(username, email, comment, ['maryamf@qatar.cmu.edu'])
        return HttpResponseRedirect('sketch/index.html')
            
    else:
        
    	return HttpResponseRedirect(reverse('index'))
  

def about(request):
    return render_to_response('sketch/about.html', {})
    
def privacy(request):
    return render_to_response('sketch/privacy.html', {})
    
@csrf_exempt
def auth_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None:
        auth.login(request, user)
        return HttpResponseRedirect(reverse('project'))
    else:
        return HttpResponseRedirect(reverse('login'))


def logout_view(request):
    print request.user
    
    auth.logout(request)
    return HttpResponseRedirect(reverse('index'))


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('login'))
    args = {}
    args.update(csrf(request))
    args['form'] = UserCreationForm()
    return render_to_response('sketch/register.html', args)


def register_success(request):
    return HttpResponseRedirect(reverse('index'))

@csrf_exempt
@login_required(login_url="/sketch/login/")
def loadSketch(request):
    s = Sketch.objects.get(id=int(request.POST['sketch_id']))
    click_map = s.clickMap
    print click_map

    return HttpResponse(click_map, content_type="application/json")

@csrf_exempt
@login_required(login_url="/sketch/login/")
def saveSketch(request):
    s = Sketch.objects.get(id=int(request.POST['sketch_id']))
    s.clickMap = request.POST['clickMap']
    s.save()

    return HttpResponse()
