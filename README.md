# Triply Server 🌍

A microservices-based travel planning platform built with NestJS, TypeScript, and Docker. Triply Server provides comprehensive travel management capabilities including user authentication, trip planning, and AI-powered travel recommendations.

## 🏗️ Architecture

The system consists of three main microservices:

### 1. **User Service** (Port: 3002)

Handles user authentication, registration, and profile management.

- OAuth and local authentication
- JWT token management
- Email verification with OTP
- User profile management

### 2. **Travel Service** (Port: 3003)

Manages trips, destinations, and travel planning features.

- Trip creation and management
- City and country data
- Route planning
- Location-based services
- OpenAI integration for intelligent travel suggestions

### 3. **Recommendation Service** (Port: 3001)

Provides personalized travel recommendations and analytics.

- AI-powered travel suggestions
- User preference analysis
- Travel data analytics

## 🛠️ Technology Stack

- **Backend Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: TypeORM
- **Authentication**: JWT with Passport.js
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **AI Integration**: OpenAI API
- **Email Service**: Nodemailer (SMTP)

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15 (if running locally)
- Redis 7 (if running locally)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/bekarasu/triply-server.git
cd triply-server
```

### 2. Start Infrastructure Services

```bash
# Start PostgreSQL and Redis
docker-compose -f docker-compose.infra.yml up -d
```

### 3. Initialize Database

Create the required databases and users by running the init scripts in each service's `database_migrations/` folder.

### 4. Start Application Services

```bash
# Start all microservices
docker-compose up -d
```

## 📚 API Documentation

Once the services are running, access the Swagger documentation:

- **User Service API**: <http://localhost:3002/user-service/api-docs>
- **Travel Service API**: <http://localhost:3003/travel-service/api-docs>
- **Recommendation Service API**: <http://localhost:3001/recommendation-service/api-docs>

## 🗄️ Database Schema

### User Service Database

- **users**: User profiles and basic information
- **local_accounts**: Local authentication credentials
- **provider_accounts**: OAuth provider accounts
- **refresh_sessions**: JWT refresh token management

### Travel Service Database

- **user_trips**: User trip information
- **user_routes**: Trip routes and itineraries
- **cities**: City master data
- **countries**: Country master data

### Recommendation Service Database

- Recommendation algorithms
- User preferences
- Analytics data

## 🔧 Development

### Database Migrations

Run the SQL migration files in the `database_migrations/` directory for each service in order:

1. `init.sql` - Initialize database and permissions
2. `migration_1.sql` - Create initial tables
3. `migration_2.sql` - Additional schema changes (if exists)

## 🐳 Docker Configuration

### Infrastructure Services

```yaml
# docker-compose.infra.yml
- PostgreSQL 15 (port 5432)
- Redis 7 (port 6379)
```

### Application Services

```yaml
# docker-compose.yml
- recommendation-service (port 3001)
- user-service (port 3002)
- travel-service (port 3003)
```

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Email verification with OTP
- Request timeout protection
- Rate limiting (Redis-based)
- Input validation and sanitization
- CORS configuration

## 🌟 Key Features

### User Management

- Multiple authentication providers (OAuth + Local)
- Email verification workflow
- Secure password management
- JWT token management with refresh

### Travel Planning

- Comprehensive city and country database
- Advanced search and filtering
- Location-based recommendations
- Trip creation and management
- Route planning capabilities

### AI Integration

- OpenAI-powered travel suggestions
- Intelligent destination recommendations
- Personalized trip planning

### Performance & Scalability

- Redis caching for improved performance
- Modular microservices architecture
- Docker containerization
- Database indexing and optimization

## 📊 Monitoring & Logging

- Structured logging with Winston
- Request/response logging middleware
- Error tracking and handling
- Performance monitoring
- Health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Burak Eren Karasu**

- GitHub: [@bekarasu](https://github.com/bekarasu)

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

---

⭐ Don't forget to star this repository if you find it helpful!
