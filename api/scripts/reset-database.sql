-- Connect to the application database
\c brew_fest_api

-- Reset database by dropping all tables
-- This allows migrations to recreate everything from scratch

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS notification_delivery CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS event_subscription CASCADE;
DROP TABLE IF EXISTS device_token CASCADE;
DROP TABLE IF EXISTS vendor_inventory_item CASCADE;
DROP TABLE IF EXISTS vendor_images CASCADE;
DROP TABLE IF EXISTS schedule_images CASCADE;
DROP TABLE IF EXISTS schedule_item CASCADE;
DROP TABLE IF EXISTS vendor CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS seaql_migrations CASCADE;

-- Verify all tables are dropped
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
