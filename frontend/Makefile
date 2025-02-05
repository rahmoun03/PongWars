# Define variables
IMAGE_NAME=my-nginx-app
CONTAINER_NAME=my-nginx-container
PORT=80

# Default target: build and run the container
all: build run

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):80 $(IMAGE_NAME)

# Stop and remove the container if it’s already running
stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Rebuild and rerun the container
restart: stop build run

# Clean up by removing the Docker image and stopping/removing the container
clean: stop
	docker rmi $(IMAGE_NAME) || true
