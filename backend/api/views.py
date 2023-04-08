from django.shortcuts import get_object_or_404
from rest_framework import decorators, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from tasks.models import Group, Task

from .serialisers import (CreateUserSerialiser, GetUserSerialiser,
                          GroupSerialiser, TaskSerialiser)
from .utils import return_all_data


class UsersSet(viewsets.ViewSet):
    def create(self, request):
        serialiser = CreateUserSerialiser(data=request.data)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serialiser = GetUserSerialiser(request.user)
        return Response(serialiser.data, status=status.HTTP_200_OK)


class TasksViewSet(viewsets.ViewSet):
    def create(self, request):
        task = request.data.get('task')
        if not task:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serialiser = TaskSerialiser(data=task)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save(author=request.user)
            return return_all_data(request)
        return Response(serialiser.error_messages, status=status.HTTP_200_OK)


class GroupsViewSet(viewsets.ViewSet):
    def list(self, request):
        return return_all_data(request)

    def create(self, request):
        data = request.data
        group = data.get('group')
        if not group:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serialiser = GroupSerialiser(data=group)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save(author=request.user)
            return return_all_data(request)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        task = get_object_or_404(Group, pk=pk)
        task.delete()
        return(return_all_data(request))

    @decorators.action(methods=["DELETE"], detail=False)
    def delete(self, request):
        data = request.data
        delete_tasks = data.get('delete_tasks')
        delete_groups = data.get('delete_groups')

        if delete_tasks:
            Task.objects.filter(id__in=delete_tasks).delete()
            return return_all_data(request)
        if delete_groups:
            Group.objects.filter(id__in=delete_groups).delete()
            return return_all_data(request)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(methods=["POST"], detail=False)
    def edit(self, request):
        data = request.data
        edit_tasks = data.get('edit_tasks')
        if not edit_tasks:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if edit_tasks:
            for task in edit_tasks:
                serialiser = TaskSerialiser(task, data=task)
                if serialiser.is_valid(raise_exception=True):
                    serialiser.save(author=request.user)
            return return_all_data(request)
        return Response(status=status.HTTP_400_BAD_REQUEST)
