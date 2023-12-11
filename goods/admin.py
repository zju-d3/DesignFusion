from django.contrib import admin

# Register your models here.
from goods import models
admin.site.register(models.Message)
