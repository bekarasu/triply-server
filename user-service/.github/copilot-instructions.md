# User Service - AI Coding Assistant Guide

## Architecture Overview

This is a **NestJS microservice** following a layered architecture with strict separation between infrastructure, business logic, and API layers.

### Core Directory Structure

- `src/infrastructure/` - Cross-cutting concerns (auth, logging, config, validation)
- `src/modules/` - Domain modules (authentication, profile, token)
- `src/libs/` - Shared libraries and domain logic
- `database_migrations/` - SQL migration files

## Key Patterns & Conventions

### 1. Configuration Management

All config is centralized in `src/infrastructure/config/` using the constants pattern:

```typescript
// Always use CONFIGS constants, never hardcode config keys
import { CONFIGS } from './infrastructure/config';
configService.get(CONFIGS.TYPEORM);
```

### 2. Authentication Architecture

- **Pluggable authenticators**: Implement `IAuthenticator` interface
- **Guard factory pattern**: `AuthenticationGuard(AuthenticatorClass)`
- **Bypass decoration**: Use `@AllowUnauthorizedRequest()` to skip auth
- **Context injection**: Use `ExecutionContextManager` for request-scoped data

### 3. API Decorators

Use composite decorators from `src/infrastructure/decorators/api.decorators.ts`:

```typescript
@UserAPI({ byPassAuthentication: true, useSwagger: true })
// Combines guards, filters, interceptors, and swagger automatically
```

### 4. Logging Infrastructure

- **Automatic request logging**: Applied via middleware to all routes
- **Factory pattern**: Use `LoggerFactory` for consistent logger instances
- **Contextual logging**: Leverages `ExecutionContextManager` for request correlation

### 5. Module Organization

- Each business module should have its own directory under `src/modules/`
- Infrastructure modules use `.forRoot()` and `.forRootAsync()` patterns
- Repository pattern: Use constants for injection tokens (e.g., `USER_REPOSITORY`)

### 6. Database & ORM

- **TypeORM** with PostgreSQL
- **Migration-first**: Use `database_migrations/` directory
- **Repository injection**: Use custom injection tokens, not direct TypeORM repos

### 7. Error Handling

- **Centralized exception filters**: Auto-applied via `ExceptionFilterModule.forRoot()`
- **Service-specific errors**: Include service name in error context
- **HTTP exception mapping**: Custom filters handle domain exceptions

## Development Workflows

### Environment Setup

```bash
# Copy and configure environment
cp .env.example .env
# Install dependencies
yarn install
# Start in development mode
yarn start:dev
```

### Docker Development

```bash
# Multi-stage build with distroless runtime
docker build -t user-service .
docker run -p 3000:3000 user-service
```

### Key Environment Variables

- `DATABASE_CONNECTION_STRING` - PostgreSQL connection
- `REDIS_CONNECTION_STRING` - Redis for caching/sessions
- `AUTH_ACCESS_TOKEN_PRIVATE_KEY` / `AUTH_ACCESS_TOKEN_PUBLIC_KEY` - JWT signing
- `DEBUG_ENABLE_SWAGGER` - Enable OpenAPI documentation

## Integration Points

### External Dependencies

- **Redis**: Session management and caching via `@liaoliaots/nestjs-redis`
- **PostgreSQL**: Primary database via TypeORM
- **JWT**: Token-based authentication with public/private key pairs
- **Email**: SMTP integration for notifications

### Inter-Service Communication

- **Internal APIs**: Use `InternalAPIAuthenticator` for service-to-service calls
- **User APIs**: Use `UserAPIAuthenticator` for client requests
- **Request timeout**: Configurable via `REQUEST_TIMEOUT_IN_MS`

## Critical Implementation Notes

1. **Never bypass the authentication decorators** - they handle multiple concerns beyond auth
2. **Use the execution context manager** for request-scoped data instead of global state
3. **Follow the module factory patterns** - `forRoot()` for static, `forRootAsync()` for dynamic config
4. **Leverage the infrastructure layer** - don't reinvent logging, validation, or error handling
5. **Database migrations are required** - never modify schema directly
