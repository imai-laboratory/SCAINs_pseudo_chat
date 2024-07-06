up:
	docker compose up -d
build:
	docker compose build --no-cache --force-rm
init:
	docker compose up -d --build
stop:
	docker compose stop
down:
	docker compose down -v
restart:
	@make down
	@make up
app:
	docker compose exec backend sh
migration:
ifndef name
	$(error message is undefined. Usage: make migration message=\"<migration name>\")
endif
	docker compose run backend alembic revision --autogenerate -m "$(name)"

migrate:
	docker compose run backend alembic upgrade head

drop:
	docker compose run backend alembic downgrade -1