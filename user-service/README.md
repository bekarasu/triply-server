# User Service

## Features

- Modular architecture with clear separation of concerns
- Custom logging and request timeout handling
- TypeORM integration for database access
- Middleware for execution context and request logging

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

```bash
cd user-service
npm install
```

### Running the Service

```bash
npm run start:dev
```

The service will start on the default port (see configuration files for details).

### Running with Docker

```bash
docker build -t user-service .
docker run -p 3000:3000 user-service
```

### Configuration

Configuration files are located in `src/infrastructure/config/`. You can adjust environment variables and settings as needed.

## Scripts

- `start:dev` - Start the service in development mode
- `start:prod` - Start the service in production mode
- `build` - Build the project
- `test` - Run tests

## API Documentation (Swagger)

This service provides interactive API documentation using [Swagger](https://swagger.io/) via the NestJS Swagger module.

### How to Access

- Once the service is running, open your browser and go to:
  
  ```shell
  http://localhost:3000/swagger
  ```

  (Replace `3000` with your configured port if different.)

### Example

If you see a section called "Sample Access Token" in the Swagger UI, you can use the provided token to authorize requests for endpoints that require authentication.

## Code Formatting

```bash
# Format code for all services
yarn format

# Lint code
yarn lint
```

## License

MIT

## Contact

For questions or support, please contact <burak.karasu@sisal.com>
