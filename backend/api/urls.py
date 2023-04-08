from django.urls import include, path
from djoser.urls import authtoken
from djoser.views import TokenCreateView, TokenDestroyView
from rest_framework import routers

from .views import GroupsViewSet, TasksViewSet, UsersSet

router = routers.DefaultRouter()

router.register(r'groups', GroupsViewSet, basename='groups')
router.register(r'tasks', TasksViewSet, basename='tasks')
router.register(r'users', UsersSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path(r'users/login/', TokenCreateView.as_view(), name='login'),
    path(r'users/logout/', TokenDestroyView.as_view(), name='logout'),
]
