# Apply-tude developer shortcuts.
#
# Requires `make`. On Windows: `choco install make` or use Git Bash with msys-make.
# Run `make` (no args) to list targets.

SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help install env dev dev-services dev-services-down seed build start typecheck \
	docker-build docker-up docker-down docker-logs docker-clean clean

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

install: ## Install npm dependencies
	npm install

env: ## Create .env from .env.example if missing
	@test -f .env || cp .env.example .env && echo "Wrote .env from template — set SESSION_SECRET before running."

dev: ## Run dev server on :5173 (expects dev-services already running)
	npm run dev

dev-services: ## Start mongo-dev, redis-dev, ollama-dev containers (host-exposed)
	docker compose up -d mongo-dev redis-dev ollama-dev

dev-services-down: ## Stop dev-only containers
	docker compose stop mongo-dev redis-dev ollama-dev

seed: ## Insert 20 sample applications into the dev database
	node --env-file=.env scripts/seed.js

build: ## Build the production bundle into build/
	npm run build

start: ## Serve the built production bundle locally (port 3000)
	npm run start

typecheck: ## Run react-router typegen + tsc
	npm run typecheck

docker-build: ## Build the production app image
	docker compose build app

docker-up: ## Start the full production stack (app + mongo + redis + ollama)
	docker compose up -d app mongo redis ollama

docker-down: ## Stop all compose services
	docker compose down

docker-logs: ## Tail the app container logs
	docker compose logs -f app

docker-clean: ## Stop containers AND delete all volumes (destroys data)
	docker compose down -v

clean: ## Remove build artefacts and node_modules
	rm -rf build .react-router node_modules
