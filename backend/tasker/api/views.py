from django.shortcuts import get_object_or_404
from djoser import utils
from djoser.serializers import SetPasswordSerializer
from rest_framework import decorators, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from tasks.models import Board, Group, Task

from .serialisers import (BoardSerialiser, CreateUserSerialiser,
                          GetUserSerialiser, GroupListSerialiser,
                          GroupSerialiser, TaskListSerializer, TaskSerialiser)
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

    @action(
        ["post", ],
        detail=False,
    )
    def set_password(self, request):
        serializer = SetPasswordSerializer(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.request.user.set_password(serializer.data["new_password"])
        self.request.user.save()
        utils.logout_user(self.request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class BoardsViewSet(viewsets.ViewSet):
    def create(self, request):
        data = request.data
        if not data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serialiser = BoardSerialiser(data=data)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save(author=request.user)
            return Response(serialiser.data, status=status.HTTP_200_OK)
        return Response(serialiser.error_messages, status=status.HTTP_200_OK)

    def list(self, request):
        boards = Board.objects.filter(author=request.user)
        serialiser = BoardSerialiser(boards, many=True)
        return Response(serialiser.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        board = get_object_or_404(Board, pk=pk)
        status_delete, _ = board.delete()
        if status_delete:
            return Response({'board': pk}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class BoardViewSet(viewsets.ViewSet):

    def list(self, request, pk=None):
        if request.user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return return_all_data(pk)

    def patch(self, request, pk=None):
        title = request.data
        board = get_object_or_404(Board, pk=pk)
        serialiser = BoardSerialiser(
            board, data={'title': title}, partial=True)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_200_OK)


class TasksViewSet(viewsets.ViewSet):

    def create(self, request):
        task = request.data.get('task')
        if not task:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serialiser = TaskSerialiser(data=task)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save(author=request.user)
            return Response(serialiser.data, status=status.HTTP_200_OK)
        return Response(serialiser.error_messages, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        task = get_object_or_404(Task, pk=pk)
        status_delete, _ = task.delete()
        if status_delete:
            return Response({'task': pk}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        title = request.data
        task = get_object_or_404(Task, pk=pk)
        serialiser = TaskSerialiser(task, data={'title': title}, partial=True)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_200_OK)

    @decorators.action(methods=["POST"], detail=False)
    def move(self, request):
        tasks = request.data.get("tasks")
        if not tasks:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        id_of_tasks = [task.get('id') for task in tasks]
        task_for_update = Task.objects.filter(id__in=id_of_tasks)
        serialiser = TaskListSerializer(
            instance=task_for_update,
            data=tasks,
            context={'tasks': tasks}
        )
        if serialiser.is_valid(raise_exception=True):
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class GroupsViewSet(viewsets.ViewSet):

    def create(self, request):
        data = request.data
        if not data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serialiser = GroupSerialiser(data=data)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save(author=request.user)
            return return_all_data(data.get('board'))
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)
        status_delete, _ = group.delete()
        if status_delete:
            return Response({'group': pk}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)
        title = request.data
        serialiser = GroupSerialiser(
            group, data={'title': title}, partial=True)
        if serialiser.is_valid(raise_exception=True):
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_200_OK)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(methods=["POST"], detail=False)
    def move(self, request):
        groups = request.data.get("boards")
        if not groups:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        id_of_groups = [group.get('id') for group in groups]
        groups_for_update = Group.objects.filter(id__in=id_of_groups)
        serialiser = GroupListSerialiser(
            instance=groups_for_update,
            data=groups,
            context={'groups': groups}
        )
        if serialiser.is_valid(raise_exception=True):
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_200_OK)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
