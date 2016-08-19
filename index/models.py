from __future__ import unicode_literals

from django.db import models

class Island(models.Model):
    name = models.CharField(max_length=256)
    cid = models.CharField(max_length=256)
    
    def __unicode__(self):
        return 'Island: ' + self.name

