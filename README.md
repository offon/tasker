# Tasker
![Python Version](https://img.shields.io/badge/python-3.9-blue) ![React Version](https://img.shields.io/badge/react-17.0.2-blue) ![Postgres Version](https://img.shields.io/badge/postgres-13.3-blue) 
![Docker Version](https://img.shields.io/badge/docker-20.10.8-blue)

Tasker - это учебное приложение, похожее по функционалу на Trello, выполненное на Django, React, Postgres и Docker Compose.

## Установка

Для установки приложения выполните следующие шаги:

1.  Убедитесь, что у вас установлен Docker и Docker Compose.
2.  Склонируйте репозиторий с помощью команды `git clone https://github.com/yourusername/tasker.git`.
3.  Перейдите в директорию проекта с помощью команды `cd tasker/infra`.
4.  Создайте файл .env в корневой директории проекта со следующим содержимым:
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
DJANGO_SETTINGS_MODULE=tasker.settings
SECRET_KEY=Ключ_для_Django_приложения
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@admin.com
DJANGO_SUPERUSER_PASSWORD=admin123456789`
```
5.  Запустите приложение с помощью команды `docker-compose up`.
6.  Откройте браузер и перейдите на страницу [http://localhost](http://localhost/).

## Описание .env файла

-   `DB_ENGINE` - указывает на тип базы данных, который будет использоваться в приложении.
-   `DB_NAME` - имя базы данных, которая будет создана при первом запуске приложения.
-   `POSTGRES_USER` - имя пользователя, который будет использоваться для подключения к базе данных Postgres.
-   `POSTGRES_PASSWORD` - пароль пользователя, который будет использоваться для подключения к базе данных Postgres.
-   `DB_HOST` - адрес хоста базы данных. В данном случае используется имя контейнера Docker, в котором будет запущена база данных.
-   `DB_PORT` - порт, на котором будет работать база данных.
-   `DJANGO_SETTINGS_MODULE` - модуль настроек Django, который будет использоваться в приложении.
-   `SECRET_KEY` - секретный ключ, который используется для генерации CSRF-токенов и хранения паролей пользователей.
-   `DJANGO_SUPERUSER_USERNAME` - имя суперпользователя, который будет создан при первом запуске приложения.
-   `DJANGO_SUPERUSER_EMAIL` - email адрес суперпользователя, который будет создан при первом запуске приложения.
-   `DJANGO_SUPERUSER_PASSWORD` - пароль суперпользователя, который будет создан при первом запуске приложения.

### Важно
При первом запуске приложения автоматически создается суперпользователь admin c паролем admin123456789, обязательно поменяйте пароль!

Если Вам не нужна эта опция удалите функцию создания пользователя из файла `backend/tasker/entrypoint.sh`
В таком случае код файла `entrypoint.sh` должен выглядеть так:
``` 
#!/bin/bash
python manage.py makemigrations
python manage.py migrate
exec gunicorn tasker.wsgi:application -b 0.0.0.0:8000
``` 

## URL-адреса

URL-адреса для данного проекта Django включают следующие маршруты:

-   `/board/<id>/`: URL для получения, обновления и удаления определенной доски. Используется метод GET, PUT и DELETE. id - это идентификатор доски.
-   `/boards/`: URL для получения списка всех досок. Используется метод GET.
-   `/groups/`: URL для получения списка всех групп задач. Используется метод GET.
-   `/tasks/`: URL для получения списка всех задач. Используется метод GET.
-   `/users/`: URL для получения списка всех пользователей. Используется метод GET.
-   `/users/login/`: URL для получения токена авторизации пользователя. Используется метод POST.
-   `/users/logout/`: URL для удаления токена авторизации пользователя. Используется метод POST.