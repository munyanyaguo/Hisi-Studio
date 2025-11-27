-- Hisi Studio Database Initialization Script
-- This runs automatically when PostgreSQL container first starts

-- Enable UUID extension (for generating unique IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema for organizing tables
CREATE SCHEMA IF NOT EXISTS hisi;

-- Set search path (so we can use tables without schema prefix)
ALTER DATABASE hisi_studio_dev SET search_path TO hisi, public;

-- Grant privileges
GRANT ALL PRIVILEGES ON SCHEMA hisi TO hisi_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA hisi TO hisi_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA hisi TO hisi_admin;

-- Create a health check function
CREATE OR REPLACE FUNCTION hisi.health_check()
RETURNS TABLE(status TEXT, check_time TIMESTAMP) AS $$
BEGIN
  RETURN QUERY SELECT 'healthy'::TEXT, NOW()::TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'Hisi Studio database initialized successfully!';
  RAISE NOTICE 'Database: hisi_studio_dev';
  RAISE NOTICE 'Schema: hisi';
  RAISE NOTICE 'User: hisi_admin';
END $$;
