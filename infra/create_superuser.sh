#!/bin/bash

python manage.py shell <<EOF
from django.contrib.auth.models import User

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@admin.ru', 'admin')
    print('Superuser created.')
else:
    print('Superuser creation skipped. User already exists.')
EOF