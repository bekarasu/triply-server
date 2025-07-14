-- this script must be run in the PostgreSQL container first by root user

-- Create analytics database
CREATE DATABASE recommandation_service OWNER triply_user;
GRANT ALL PRIVILEGES ON DATABASE recommandation_service TO triply_user;

-- Set up permissions
\c recommandation_service;

-- Grant schema permissions (these were missing)
GRANT USAGE ON SCHEMA public TO triply_user;
GRANT CREATE ON SCHEMA public TO triply_user;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO triply_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO triply_user;

-- Grant permissions on future objects (important!)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO triply_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO triply_user;