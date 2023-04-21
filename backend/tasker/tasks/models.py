from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(max_length=250, blank=False, unique=True)

    def __str__(self) -> str:
        return self.email


class Board(models.Model):
    title = models.CharField(max_length=150)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.title


class Group(models.Model):
    title = models.CharField(max_length=150)
    board = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name='groups')
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='users_groups')
    position = models.PositiveIntegerField(null=True)

    def __str__(self) -> str:
        return self.title


class Task(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='tasks')
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name='group')
    title = models.CharField(max_length=250)
    pub_date = models.DateTimeField(auto_now_add=True)
    position = models.PositiveIntegerField(null=True)

    def __str__(self) -> str:
        return self.title
