# Тестовое задание "Система бронирования мест"

## Задача

Реализовать API для бронирования места на мероприятие. Один пользователь не может забронировать дважды на одно событие.

POST /api/bookings/reserve
{
  "event_id": 1,
  "user_id": "user123"
}

Таблица `events`:
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- total_seats (INT)

Таблица `bookings`:
- id (SERIAL PRIMARY KEY)
- event_id (INT, ссылка на events)
- user_id (VARCHAR)
- created_at (TIMESTAMP)

## Инструкция

1. Клонируйте репозиторий.

```sh
git clone git@github.com:Piterden/bookings-reserve.git
```

2. Создайте `.env` файл из шаблона: 

```sh
cp example.env .env
```

3. Запустите контейнеры: 

```sh
docker compose up --build
```

4. При первом старте, необходимо запустить миграции и сидеры:

```sh
docker exec app npm run migrate
docker exec app npm run seed
```

5. Приложение запущено. Можно обращаться с POST-запросом к ручке `/api/bookings/reserve`:

```sh
curl 'http://localhost:5000/api/bookings/reserve' \
  -H 'Content-Type: application/json' \
  -X POST \
  --data-raw '{"event_id":1,"user_id":"user1"}'
```
