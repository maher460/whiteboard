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
from django.core.mail import send_mail

# Create your views here.


@login_required(login_url="/sketch/login/")
def project(request):
    bridges_list = Bridge.objects.filter(user=request.user)
    sketch_list = []
    for bridge in bridges_list:
        sketch_list.append(Sketch.objects.filter(project=bridge)[0])

    c = {'bridges_list': bridges_list, 'sketch_list': sketch_list, 'user_id':request.user.username}
    c.update(csrf(request))

    return render_to_response('sketch/project.html', c)


def contact(request):
    loggedin = request.user.is_authenticated()
    c = {'loggedin': loggedin, 'user_id':request.user.username}
    c.update(csrf(request))
    
    return render_to_response('sketch/contact.html', c)

def contactform(request):
    name = request.POST.get('name', '')
    email = request.POST.get('email', '')
    comment = request.POST.get('comment', '')
    if name and email and comment:
        try:
            send_mail(name, email, comment, ['whiteboardcmuq@gmail.com'], fail_silently=False)
        except BadHeaderError:
            return HttpResponse('Invalid header found.')
        return HttpResponseRedirect(reverse('index'))
    else:
        return HttpResponse('Make sure all fields are entered and valid.')


def about(request):
    loggedin = request.user.is_authenticated()
    return render_to_response('sketch/about.html', {'loggedin': loggedin, 'user_id':request.user.username})


def privacy(request):
    loggedin = request.user.is_authenticated()
    return render_to_response('sketch/privacy.html', {'loggedin': loggedin, 'user_id':request.user.username})


@login_required(login_url="/sketch/login/")
def sketch(request, project_id):
    loggedin = request.user.is_authenticated()

    p = Project.objects.get(name=project_id)

    sketch_list = Sketch.objects.filter(project=p)

    sketch_id = str(sketch_list[0].id)

    project_id = p.name + "_id_" + str(p.id)

    c = {'project_id': project_id, 'sketch_list': sketch_list, 'sketch_id': sketch_id,
         'user_id': request.user.username, 'loggedin': loggedin}
    c.update(csrf(request))

    return render_to_response('sketch/sketch.html', c)


@login_required(login_url="/sketch/login/")
def add_project(request):
    if Project.objects.filter(name=request.POST['projectName']):
        return HttpResponse("Error: Project name already exists! Please go back and choose another name!")

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


@login_required(login_url="/sketch/login/")
def select_project(request):
    p = Project.objects.get(name=request.POST['projectName'])
    # sketch_id = str(Sketch.objects.filter(project=p)[0].id)
    project_id = p.name  # + "_" + str(p.id)

    return HttpResponseRedirect(reverse('sketch', kwargs={'project_id': project_id}))


def index(request):
    loggedin = request.user.is_authenticated()
    username=request.user
    # c = {}
    #c.update(csrf(request))
    return render_to_response('sketch/index.html', {'loggedin': loggedin, 'user_id':username})


def login(request):
    loggedin = request.user.is_authenticated
    c = {}
    c.update(csrf(request))
    c.update({'loggedin': loggedin})
    return render_to_response('sketch/login.html', c)


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


def register_user(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('login'))
    args = {}
    loggedin = request.user.is_authenticated
    args.update(csrf(request))
    args.update({'loggedin': loggedin})
    args['form'] = UserCreationForm()
    return render_to_response('sketch/register.html', args)


def register_success(request):
    return HttpResponseRedirect(reverse('index'))


@login_required(login_url="/sketch/login/")
def loadSketch(request):
    s = Sketch.objects.get(id=int(request.POST['sketch_id']))
    click_map = s.clickMap

    return HttpResponse(click_map, content_type="application/json")


@login_required(login_url="/sketch/login/")
def saveSketch(request):
    s = Sketch.objects.get(id=int(request.POST['sketch_id']))
    s.clickMap = request.POST['clickMap']
    s.save()

    return HttpResponse()


@login_required(login_url="/sketch/login/")
def add_sketch(request):
    temp2 = request.POST['projectName']
    temp2 = temp2.split("_")[0]
    # print temp2
    p = Project.objects.get(name=temp2)
    tempName = request.user.username
    s = Sketch(project=p,
               # clickMap=json.dumps({tempName: [[], [], [], []]}))
               clickMap=json.dumps({}))
    s.save()

    return HttpResponse(str(s.id))

    # temp = p.name  # + "_" + str(p.id)
    #return HttpResponseRedirect(reverse('sketch', kwargs={'project_id': temp}))


@login_required(login_url="/sketch/login/")
def delete_project(request):
    print Project.objects.filter(name=request.POST['project_name'])
    Project.objects.filter(name=request.POST['project_name']).delete()
    print Project.objects.filter(name=request.POST['project_name'])

    return HttpResponse()
