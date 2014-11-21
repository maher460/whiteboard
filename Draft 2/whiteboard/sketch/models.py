from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Project(models.Model):
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return str(self.name)


class Bridge(models.Model):
    user = models.ForeignKey(User, unique=False, null=False)
    project = models.ForeignKey(Project, unique=False, null=False)


class Sketch(models.Model):
    project = models.ForeignKey(Project, unique=True, null=False)
    clickMap = models.TextField()

    def __unicode__(self):
        return str(self.id)