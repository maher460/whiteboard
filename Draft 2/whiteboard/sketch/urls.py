from django.conf.urls import patterns, include, url
from sketch import views

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'whiteboard.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),
                       url(r'^$', views.index, name='index'),
                       # url(r'^admin/', include(admin.site.urls)),
                       url(r'^login/$', views.login, name='login'),
                       url(r'^auth/$', views.auth_view, name='auth_view'),
                       url(r'^logout/$', views.logout_view, name='logout'),
                       url(r'^register/$', views.register_user, name='register_user'),
                       url(r'^register_success/$', views.register_success),

                       #url(r'^sketch/$', views.sketch, name='sketch'),
                       url(r'^project/$', views.project, name='project'),
                       url(r'^add_project/$', views.add_project, name='add_project'),
                       url(r'^sketch/(?P<project_id>\w+)/$',
                           views.sketch,
                           name='sketch'),

                       url(r'^loadSketch/$', views.loadSketch, name='loadSketch'),
                       url(r'^saveSketch/$', views.saveSketch, name='saveSketch'),
                       url(r'^select_project/$', views.select_project, name='select_project'),
                       url(r'^add_sketch/$', views.add_sketch, name='add_sketch'),



)
