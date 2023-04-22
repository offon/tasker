from django.db import transaction
from rest_framework import serializers

from tasks.models import Board, Group, Task, User


class CreateUserSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', "first_name", "last_name", "password")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class GetUserSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email']


class BoardSerialiser(serializers.ModelSerializer):

    class Meta:
        model = Board
        fields = ('id', 'title')


class GroupSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['title', 'board', 'position']


class GroupUpdateSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['title', 'board', 'position']

    def update(self, instance, validated_data):
        instance.position = validated_data.get('position', instance.position)
        instance.save()
        return instance


class GroupListSerialiser(serializers.ListSerializer):
    child = GroupUpdateSerialiser()

    def validate(self, attrs):
        return attrs

    def update(self, instance, validated_data):
        for group_data in self.context.get('groups'):
            group_id = group_data.get('id')
            group = instance.get(id=group_id)
            if group is not None:
                self.child.update(validated_data=group_data, instance=group)
        return instance


class TaskCreateSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'position']


class TaskSerialiser(serializers.ModelSerializer):
    group = serializers.IntegerField(source='group_id')

    class Meta:
        model = Task
        fields = ['id', 'group', 'title', 'position']


class TaskUpdateSerialiser(TaskSerialiser):

    def update(self, instance, validated_data):
        group = Group.objects.get(id=validated_data.get('group'))
        instance.position = validated_data.get('position', instance.position)
        instance.group = group or instance.group
        instance.save()
        return instance


class TaskListSerializer(serializers.ListSerializer):
    child = TaskUpdateSerialiser()

    def update(self, instance, validated_data):
        for task_data in self.context.get('tasks'):
            task_id = task_data.get('id')
            task = instance.get(id=task_id)
            if task is not None:
                self.child.update(validated_data=task_data, instance=task)
        return instance


class GroupsCreateSerialiser(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'title', 'tasks', 'position', 'board']

    def get_tasks(self, object):
        tasks = list(Task.objects.filter(group=object).order_by("position"))
        if tasks:
            serialiser = TaskSerialiser(tasks, many=True)
            return serialiser.data
        return []

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        group_name = validated_data.get('title')
        author = validated_data.get('author')
        for initial_task in self.initial_data:
            if group_name == initial_task.get('title'):
                data = initial_task
                break

        with transaction.atomic():
            tasks = []
            if data.get('tasks'):
                tasks = data.pop('tasks')
            group, _ = Group.objects.get_or_create(**validated_data)
            if tasks:
                tasks = TaskCreateSerialiser(data=tasks, many=True)
                if tasks.is_valid(raise_exception=True):
                    tasks.save(group=group, author=author)
            return group


class BoardsEdirSerialiser(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['groups']

    def validate(self, attrs):
        return attrs

    def get_groups(self, object):
        serialiser = GroupsCreateSerialiser(object, many=True)
        return serialiser.data

    def create(self, validated_data):
        groups = self.initial_data.get('groups')
        author = validated_data.get('author')
        delete_tasks = self.initial_data.pop('delete_tasks')
        with transaction.atomic():
            if delete_tasks:
                Task.objects.filter(id__in=delete_tasks).delete()
            Group.objects.all().delete()
            serialiser = GroupsCreateSerialiser(data=groups, many=True)
            if serialiser.is_valid(raise_exception=True):
                serialiser.save(author=validated_data['author'])
                queryset = author.users_groups.all()
                return list(queryset)
