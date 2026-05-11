# QR Data Processor & Scanner - Full Stack

This is a full-stack, multi-user version of the QR Data Processor application, containerized with Docker.

## Architecture

-   **Frontend:** React (Vite) application served by Nginx.
-   **Backend:** Node.js with Express, TypeScript, and JWT for authentication.
-   **Database:** MongoDB for data persistence.

All services are orchestrated using Docker Compose.

## Prerequisites

-   Docker
-   Docker Compose

## How to Run

1.  **Clone the repository** and navigate to the project's root directory (where `docker-compose.yml` is located).

2.  **Build and run the services** using Docker Compose. This command will build the images for the frontend and backend, pull the MongoDB image, and start all containers in detached mode.

    ```bash
    docker-compose up --build -d
    ```

3.  **Access the application:** Open your web browser and navigate to:

    [http://localhost:8008](http://localhost:8008)

    The application will be running on port `8008`.

## How it Works

-   The `frontend` service builds the React application and serves it using an Nginx web server. Nginx is also configured to act as a reverse proxy, forwarding any requests from the browser that start with `/api` to the backend service.
-   The `backend` service runs the Node.js/Express API, which handles user authentication and CRUD operations for the data.
-   The `db` service runs a MongoDB instance, which the backend connects to for storing user and item data.
-   Data for the MongoDB instance is persisted in a Docker volume named `mongo-data` on your host machine, so you won't lose data when you stop and start the containers.

## Stopping the Application

To stop all the running containers, execute the following command in the project's root directory:

```bash
docker-compose down
```

This will stop and remove the containers. To also remove the database volume (deleting all data), you can run `docker-compose down -v`.
