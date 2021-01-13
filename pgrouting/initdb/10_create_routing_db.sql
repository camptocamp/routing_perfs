CREATE USER routing_user WITH PASSWORD 'routing';
CREATE DATABASE routing_db OWNER routing_user;
ALTER USER routing_user WITH SUPERUSER;
\c routing_db
CREATE EXTENSION postgis;
CREATE EXTENSION pgrouting;
