from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response

from tasks.models import Board

from .serialisers import GroupsCreateSerialiser


def return_all_data(pk):
    board = get_object_or_404(Board, pk=pk)
    queryset = board.groups.all().order_by("position")
    serialiser = GroupsCreateSerialiser(queryset, many=True)
    return Response(serialiser.data, status=status.HTTP_200_OK)
