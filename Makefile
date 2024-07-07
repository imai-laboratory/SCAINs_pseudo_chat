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

.PHONY: migration
migration:
	@if [ "$(name)" = "" ]; then \
		echo "Error: name argument is required"; \
		exit 1; \
	fi
	docker compose run backend alembic revision -m "$(name)"
migrate:
	docker compose run backend alembic upgrade head
drop:
	docker compose exec db psql -U postgres -d scains-db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker compose exec db psql -U postgres -d scains-db -c "DROP TABLE IF EXISTS alembic_version;"
