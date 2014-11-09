from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Project(models.Model):
    user_id=models.ForeignKey(User, unique=False, null=False)
    
class Sketch(models.Model):
    clickx=models.TextField()
    clicky=models.TextField()
    clickdrag = models.TextField()
    clickcolor = models.TextField()
    project=models.ForeignKey(Project, unique=True, null=False)
    def __unicode__(self):
        return str(self.id)
