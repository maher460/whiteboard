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

# Create your views here.

@csrf_exempt
def project(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('sketch/project.html', {})


@csrf_exempt
def sketch(request, project_id):
    c = {}
    c.update(csrf(request))

    return render_to_response('sketch/sketch.html', {'project_id': project_id})

@csrf_exempt
@login_required(login_url="/sketch/login/")
def add_project(request):
    p = Project(name=request.POST['projectName'])
    p.save()

    s = Sketch(project=p,
               clickMap=json.dumps({}))
    s.save()

    b = Bridge(user=request.user,
               project=p)
    b.save()

    temp = p.name + "_" + str(p.id)

    return HttpResponseRedirect(reverse('sketch', kwargs={'project_id': temp}))



@csrf_exempt
def index(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('sketch/index.html', {})


def login(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('sketch/login.html', c)


@csrf_exempt
def auth_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None:
        auth.login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return HttpResponseRedirect(reverse('login'))


def logout_view(request):
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
