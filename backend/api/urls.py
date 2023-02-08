from django.urls import include, path
from djoser.urls import authtoken
from rest_framework import routers

from .views import GroupsViewSet, TasksViewSet, me

router = routers.DefaultRouter()

router.register(r'groups', GroupsViewSet, basename='groups')
router.register(r'items', TasksViewSet, basename='items')

urlpatterns = [
    path('', include(router.urls)),
    path('users/me/', me),
    path(r'auth/', include(authtoken)),
]
