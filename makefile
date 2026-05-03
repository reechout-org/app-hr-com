GCP_REGION ?= us-west1
PROJECT_ID ?= hr-app-475516
GIT_SHA    := $(shell git rev-parse HEAD)
IMAGE      := $(GCP_REGION)-docker.pkg.dev/$(PROJECT_ID)/cloud-run-source-deploy/app-hr-com
BUILD_TAG  ?= latest
SERVICE    := app-hr-com

BUILD_ARGS := \
	--build-arg NEXT_PUBLIC_API_URL \
	--build-arg NEXT_PUBLIC_FIREBASE_API_KEY \
	--build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
	--build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID \
	--build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
	--build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
	--build-arg NEXT_PUBLIC_FIREBASE_APP_ID \
	--build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID \
	--build-arg NEXT_PUBLIC_FIREBASE_VAPID_KEY \
	--build-arg NEXT_PUBLIC_RECAPTCHA_SITE_KEY

.DEFAULT_GOAL := build

dev:
	bun run dev

build:
	bun run build

lint:
	bun run lint

build-image:
	docker buildx build \
		--platform "linux/amd64" \
		--tag "$(IMAGE):$(GIT_SHA)-build" \
		--target "builder" \
		$(BUILD_ARGS) \
		.
	docker buildx build \
		--cache-from "$(IMAGE):$(GIT_SHA)-build" \
		--platform "linux/amd64" \
		--tag "$(IMAGE):$(GIT_SHA)" \
		$(BUILD_ARGS) \
		.

build-image-login:
	gcloud auth configure-docker $(GCP_REGION)-docker.pkg.dev --quiet

build-image-push: build-image-login
	docker image push $(IMAGE):$(GIT_SHA)

build-image-push-build-stage: build-image-login
	docker image push $(IMAGE):$(GIT_SHA)-build

build-image-pull: build-image-login
	docker image pull $(IMAGE):$(GIT_SHA)

build-image-promote: build-image-login
	docker image tag $(IMAGE):$(GIT_SHA) $(IMAGE):$(BUILD_TAG)
	docker image push $(IMAGE):$(BUILD_TAG)
