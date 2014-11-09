from django.conf.urls import patterns, include, url
from sketch import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'whiteboard.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', views.index, name='index'),
  #  url(r'^admin/', include(admin.site.urls)),
  url(r'^login/$', views.login, name='login'),
  url(r'^auth/$',  views.auth_view, name='auth_view'),
  url(r'^logout/$', views.logout_view, name='logout'),
  url(r'^register/$', views.register_user, name='register_user'),
  url(r'^register_success/$', views.register_success),
)
