-- liquibase formatted sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(20) NULL,
  surname VARCHAR(20) NULL,
  email VARCHAR(100) NULL,
  phone_number VARCHAR(15) NULL,
  status VARCHAR(10) DEFAULT 'INIT' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  UNIQUE (email),
  UNIQUE (phone_number)
);

CREATE TABLE refresh_sessions (
  id VARCHAR(36) NOT NULL,
  refresh_session VARCHAR(36) DEFAULT '' NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE TABLE provider_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) NULL,
  provider VARCHAR(10) NOT NULL,
  provider_id VARCHAR(100) NULL,
  metadata JSON NULL,
  user_id VARCHAR(36) NOT NULL,
  updated_at timestamp DEFAULT NOW() NULL,
  created_at timestamp DEFAULT NOW() NULL,
  deleted_at timestamp NULL
);

CREATE TABLE local_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15) NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  UNIQUE (email),
  UNIQUE (phone_number)
);