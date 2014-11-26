# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sketch', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bridge',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('project', models.ForeignKey(to='sketch.Project')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='project',
            name='user_id',
        ),
        migrations.RemoveField(
            model_name='sketch',
            name='clickcolor',
        ),
        migrations.RemoveField(
            model_name='sketch',
            name='clickdrag',
        ),
        migrations.RemoveField(
            model_name='sketch',
            name='clickx',
        ),
        migrations.RemoveField(
            model_name='sketch',
            name='clicky',
        ),
        migrations.AddField(
            model_name='project',
            name='name',
            field=models.CharField(default='dfdsfsf', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='sketch',
            name='clickMap',
            field=models.TextField(default='dfdsf'),
            preserve_default=False,
        ),
    ]
