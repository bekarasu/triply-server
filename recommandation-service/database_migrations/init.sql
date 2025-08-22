-- this script must be run in the PostgreSQL container first by root user
-- this script must be run line by line

CREATE DATABASE recommendation_service OWNER triply_user;
GRANT ALL PRIVILEGES ON DATABASE recommendation_service TO triply_user;
\c recommendation_service;
GRANT USAGE ON SCHEMA public TO triply_user;
GRANT CREATE ON SCHEMA public TO triply_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO triply_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO triply_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO triply_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO triply_user;