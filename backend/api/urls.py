from django.urls import include, path
from djoser.urls import authtoken
from rest_framework import routers

from .views import GroupsViewSet, TasksViewSet, UsersSet

router = routers.DefaultRouter()

router.register(r'groups', GroupsViewSet, basename='groups')
router.register(r'items', TasksViewSet, basename='items')
router.register(r'users', UsersSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path(r'users/auth/', include(authtoken)),
]
