SHELL=/bin/bash

up:
	@docker-compose up --build -d

down:
	@docker-compose down

rm:
	@docker system prune -af

re: rm up

clear: down rm
	@docker volume rm $(shell docker volume ls -q)
	@docker network rm $(shell docker network ls -q)
