from rest_framework import status
from rest_framework.response import Response

from .serialisers import GroupsCreateSerialiser


def return_all_data(request):
    queryset = request.user.users_groups.all()
    serializer = GroupsCreateSerialiser(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
