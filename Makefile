up:
	docker compose up -d
build:
	docker compose build --no-cache --force-rm
init:
	docker compose up -d --build
stop:
	docker compose stop
down:
	docker compose down
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
	docker compose exec backend alembic revision -m "$(name)"
migrate:
	docker compose exec backend alembic upgrade head
drop:
	docker compose exec db psql -U postgres -d scains-db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	docker compose exec db psql -U postgres -d scains-db -c "DROP TABLE IF EXISTS alembic_version;"
current:
	docker compose exec backend alembic current
history:
	docker compose exec backend alembic history
downgrade:
	@if [ "$(n)" = "" ]; then \
		echo "Error: name argument is required"; \
		exit 1; \
	fi
	docker compose exec backend alembic downgrade "$(n)"