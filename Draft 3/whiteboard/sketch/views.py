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

# Create your views here.

@csrf_exempt
@login_required(login_url="/sketch/login/")
def project(request):
    c = {}
    c.update(csrf(request))
    bridges_list = Bridge.objects.filter(user=request.user)
    return render_to_response('sketch/project.html', {'bridges_list': bridges_list})


@csrf_exempt
@login_required(login_url="/sketch/login/")
def sketch(request, project_id):
    c = {}
    c.update(csrf(request))

    p = Project.objects.get(name=project_id)

    sketch_list = Sketch.objects.filter(project=p)

    sketch_id = str(sketch_list[0].id)

    project_id = p.name + "_id_" + str(p.id)

    return render_to_response('sketch/sketch.html',
                              {'project_id': project_id, 'sketch_list': sketch_list, 'sketch_id': sketch_id,
                               'user_id': request.user.username})


@csrf_exempt
@login_required(login_url="/sketch/login/")
def add_project(request):
    p = Project(name=request.POST['projectName'])
    p.save()

    tempName = request.user.username
    s = Sketch(project=p,
              # clickMap=json.dumps({tempName: [[], [], [], []]}))
              clickMap=json.dumps({}))
    s.save()

    b = Bridge(user=request.user,
               project=p)
    b.save()

    # temp = p.name + "_" + str(p.id)

    return HttpResponseRedirect(reverse('sketch', kwargs={'project_id': p.name}))


@csrf_exempt
@login_required(login_url="/sketch/login/")
def select_project(request):
    p = Project.objects.get(name=request.POST['projectName'])
    # sketch_id = str(Sketch.objects.filter(project=p)[0].id)
    project_id = p.name  # + "_" + str(p.id)

    return HttpResponseRedirect(reverse('sketch', kwargs={'project_id': project_id}))


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
        return HttpResponseRedirect(reverse('project'))
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


@csrf_exempt
@login_required(login_url="/sketch/login/")
def loadSketch(request):
    s = Sketch.objects.get(id=int(request.POST['sketch_id']))
    click_map = s.clickMap

    return HttpResponse(click_map, content_type="application/json")


@csrf_exempt
@login_required(login_url="/sketch/login/")
def saveSketch(request):
    s = Sketch.objects.get(id=int(request.POST['sketch_id']))
    s.clickMap = request.POST['clickMap']
    s.save()

    return HttpResponse()


@csrf_exempt
@login_required(login_url="/sketch/login/")
def add_sketch(request):
    temp2 = request.POST['projectName']
    temp2 = temp2.split("_")[0]
    # print temp2
    p = Project.objects.get(name=temp2)
    tempName = request.user.username
    s = Sketch(project=p,
               #clickMap=json.dumps({tempName: [[], [], [], []]}))
               clickMap=json.dumps({}))
    s.save()

    return HttpResponse(str(s.id))

    #temp = p.name  # + "_" + str(p.id)
    #return HttpResponseRedirect(reverse('sketch', kwargs={'project_id': temp}))

