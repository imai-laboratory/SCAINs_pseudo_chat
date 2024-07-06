up:
	docker compose up -d
build:
	docker compose build --no-cache --force-rm
init:
	docker compose up -d --build
stop:
	docker compose stop
down:
	docker compose down --remove-orphans
restart:
	@make down
	@make up