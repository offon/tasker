from rest_framework import decorators, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tasks.models import Group, Task
from django.shortcuts import get_object_or_404

from .serialisers import (GetUserSerialiser, GroupsCreateSerialiser,
                          GroupSerialiser, TaskSerialiser)
from .utils import return_all_data


@api_view(['GET'])
def me(request):
    serialiser = GetUserSerialiser(request.user)
    return Response(serialiser.data, status=status.HTTP_200_OK)


class TasksViewSet(viewsets.ViewSet):
    def create(self, request):
        item = request.data.get('item')
        if not item:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serialiser = TaskSerialiser(data=item)
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
        item = get_object_or_404(Group, pk=pk)
        item.delete()
        return(return_all_data(request))

    @decorators.action(methods=["DELETE"], detail=False)
    def delete(self, request):
        data = request.data
        delete_items = data.get('delete_items')
        delete_groups = data.get('delete_groups')

        if delete_items:
            Task.objects.filter(id__in=delete_items).delete()
            return return_all_data(request)
        if delete_groups:
            Group.objects.filter(id__in=delete_groups).delete()
            return return_all_data(request)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(methods=["POST"], detail=False)
    def edit(self, request):
        data = request.data
        edit_items = data.get('edit_items')
        if not edit_items:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if edit_items:
            for item in edit_items:
                serialiser = TaskSerialiser(item, data=item)
                if serialiser.is_valid(raise_exception=True):
                    serialiser.save(author=request.user)
            return return_all_data(request)
        return Response(status=status.HTTP_400_BAD_REQUEST)

