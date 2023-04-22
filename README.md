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

## Описание приложения

Приложение состоит из четырех контейнеров Docker, каждый из которых выполняет свою функцию:

1.  **web** - это контейнер, который содержит фреймворк Django и все необходимые зависимости для работы с ним.
    
2.  **db** - это контейнер, который содержит базу данных PostgreSQL. Он используется для хранения данных приложения..
    
3.  **nginx** - это контейнер, который содержит веб-сервер Nginx. Он используется для проксирования запросов к приложению и обеспечения доступа к нему через интернет.
    
4.  **frontend** - это контейнер, который содержит фронтенд приложение, написанное с использованием React. Он компилируется при первом запуске, копирует необходимые данные для работы nginx.

## URL-адреса

URL-адреса для данного проекта Django включают следующие маршруты:

-   `/board/<id>/`: URL для получения, обновления и удаления определенной доски. Используется метод GET, PUT и DELETE. id - это идентификатор доски.
-   `/boards/`: URL для получения списка всех досок. Используется метод GET.
-   `/groups/`: URL для получения списка всех групп задач. Используется метод GET.
-   `/tasks/`: URL для получения списка всех задач. Используется метод GET.
-   `/users/`: URL для получения списка всех пользователей. Используется метод GET.
-   `/users/login/`: URL для получения токена авторизации пользователя. Используется метод POST.
-   `/users/logout/`: URL для удаления токена авторизации пользователя. Используется метод POST.

## Регистрация пользователя

### Запрос

`POST /api/api/users/`

### Параметры запроса
```
{
    email: "name@email.ru",
    password: "password",
    username: "name",
    first_name: "name",
    last_name: "name"
    }
```
### Пример ответа

```
{
    "username":"name",
    "email":"name@email.ru",
    "first_name":"",
    "last_name":"",
    "password":"pbkdf2_sha256$390000$JkBMN4TjIugIJhMph4kLSt$65Df992aPywrKVrpPKIb5FwSiCjrYM3BlU3X6WVWXGw="
    }
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 201 | Created |

## Авторизация пользователя

### Запрос

`POST /api/users/login/`

### Параметры запроса
```
{
    email: "name@email.ru",
    password: "password"
    }
```
### Пример ответа

```
{
    "auth_token":"e38a3c4e53804a94820e8f2d66fcc990f89045ee"
    }
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |

## Изменение пароля пользователя

### Запрос

`POST /api/users/set_password/`

### Параметры запроса
```
{
    current_password: "old_password",
    new_password: "new_password"
    }
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 204 | No Content |

## Выход пользователя, удаление токена авторизации

### Запрос

`POST /api/users/logout/`


### Коды ответа
| Код ответа | Описание |
|--|--|
| 401  | Unauthorized |


## Данные пользователя

### Запрос

`GET /api/users/me/`

### Пример ответа

```
{
    "username":"name",
    "email":"name@email.ru",
    "first_name":"",
    "last_name":"",
    }
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |


## Список доступных досок

### Запрос

`GET /api/boards/`

### Пример ответа

```
[
    {
        "id":1,
        "title":"Main"
    },
    {
        "id":2,
        "title":"Учеба"
    }
]
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |


## Задачи выбранной доски

### Запрос

`GET /api/board/<id>/`

### Пример ответа

```
[
    {
        "id": 1,
        "title": "Заплаиновано",
        "tasks": [
            {
                "id": 5,
                "group": 6,
                "title": "Купить",
                "position": 1
            },
            {
                "id": 4,
                "group": 6,
                "title": "Продать",
                "position": 2
            },
            {
                "id": 3,
                "group": 6,
                "title": "Заплатить",
                "position": 3
            }
        ],
        "position": 1,
        "board": 2
    },
    {
        "id": 4,
        "title": "В работе",
        "tasks": [],
        "position": 2,
        "board": 2
    },
    {
        "id": 5,
        "title": "Выполнено",
        "tasks": [],
        "position": 3,
        "board": 2
    }
]
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |

## Изменение доски

### Запрос

`PATCH /api/board/<id>/`

### Параметры запроса
```
{
    "string"
}
```

### Пример ответа

```
{
    "id": 2,
    "title": "string"
}
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |


## Удаление доски

### Запрос

`DELETE /api/board/<id>/`


### Пример ответа

```
{
    "id": 2,
    "title": "string"
}
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |

## Создание группы задач

### Запрос

`POST /api/groups/`

### Параметры запроса
```
{
    "board": "2",
    "title": "Новая группа",
    "position": 4
}
```

### Пример ответа

```
[
    {
        "id": 8,
        "title": "Новая группа",
        "tasks": [],
        "position": 4,
        "board": 2
    }
]
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |


## Изменение группы задач

### Запрос

`PATCH /api/groups/<id>/`

### Параметры запроса
```
{
    "string"
}
```

### Пример ответа

```
{
    "title": "string",
    "board": 2,
    "position": 3
}
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |

## Удаление группы задач

### Запрос

`DELETE /api/groups/<id>/`


### Пример ответа

```
{
    "group": "5"
}
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |

## Изменение позиции группы задач на доске

### Запрос

`POST /api/groups/move/`

### Параметры запроса
```
{
    "boards": [
        {
            "id": 7,
            "title": "Первая группа",
            "tasks": [],
            "position": 1,
            "board": 2
        },
        {
            "id": 4,
            "title": "Вторая группа",
            "tasks": [],
            "position": 2,
            "board": 2
        },
        {
            "id": 6,
            "title": "4",
            "tasks": [
                {
                    "id": 5,
                    "group": 6,
                    "title": "3",
                    "position": 1
                },
                {
                    "id": 4,
                    "group": 6,
                    "title": "2",
                    "position": 2
                },
                {
                    "id": 3,
                    "group": 6,
                    "title": "1",
                    "position": 3
                }
            ],
            "position": 3,
            "board": 2
        }
    ]
}
```

### Пример ответа

```
[
    {
        "title": "3",
        "board": 2,
        "position": 3
    },
    {
        "title": "Вторая группа",
        "board": 2,
        "position": 2
    },
    {
        "title": "Первая группа",
        "board": 2,
        "position": 1
    }
]
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |


## Задачи

### Запрос

`POST /api/tasks/`

### Параметры запроса
```
{
    "task": {
        "title": "Новая задача",
        "group": 7,
        "position": 1
    }
}
```

### Пример ответа

```
{
    "id": 6,
    "group": 7,
    "title": "Новая задача",
    "position": 1
}
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |


## Изменение задачи

### Запрос

`PATCH /api/tasks/<id>/`

### Параметры запроса
```
{
    "string"
}
```

### Пример ответа

```
{
    "id": 6,
    "group": 7,
    "title": "string",
    "position": 1
}
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |

## Удаление задачи

### Запрос

`DELETE /api/tasks/<id>/`


### Пример ответа

```
{
    "task": "7"
}
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |

## Изменение позиции задачи, при перемещении

### Запрос

`POST /api/tasks/move/`

### Параметры запроса
```
{
    "tasks": [
        {
            "id": 6,
            "group": 7,
            "title": "Исправленная задача",
            "position": 1
        },
        {
            "id": 8,
            "group": 4,
            "title": "задача для перемещения",
            "position": 1
        }
    ]
}
```

### Пример ответа

```
[
    {
        "id": 6,
        "group": 7,
        "title": "Исправленная задача",
        "position": 1
    },
    {
        "id": 8,
        "group": 7,
        "title": "задача для перемещения",
        "position": 2
    }
]
```

### Коды ответа
| Код ответа | Описание |
|--|--|
| 200 | OK |