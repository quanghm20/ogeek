NAME = otable
VERSION = 1.0
CUR_DIR = $(shell basename $(CURDIR))
CURRENT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)
DOCKER_FILE ?= docker-compose.yml

.PHONY: start dev_up composer bower dbmigrate

info:
	$(info CURRENT_BRANCH: $(CURRENT_BRANCH))
	$(info DOCKER_FILE: $(DOCKER_FILE))

dev_up:
	docker-compose -f $(DOCKER_FILE) up -d --remove-orphans
	npm run start:dev

down:
	docker-compose -f $(DOCKER_FILE) down
