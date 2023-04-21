#!/bin/bash

python manage.py makemigrations
python manage.py migrate

if [ -z "$(python -c "import django; django.setup(); from django.contrib.auth.models import User; User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists()")" ]; then
    python manage.py createsuperuser --noinput --username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL
    echo "Superuser created."
fi

exec gunicorn tasker.wsgi:application -b 0.0.0.0:8000
