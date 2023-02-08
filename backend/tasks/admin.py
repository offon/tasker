from django.contrib import admin

from .models import Board, Group, Task, User

admin.site.register(User)
admin.site.register(Board)
admin.site.register(Group)
admin.site.register(Task)
