from rest_framework import status
from rest_framework.response import Response

from .serialisers import GroupsCreateSerialiser


def return_all_data(request):
    queryset = request.user.users_groups.all()
    serialiser = GroupsCreateSerialiser(queryset, many=True)
    return Response(serialiser.data, status=status.HTTP_200_OK)
