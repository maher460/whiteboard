# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sketch', '0002_auto_20141121_1711'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sketch',
            name='project',
            field=models.ForeignKey(to='sketch.Project'),
        ),
    ]
