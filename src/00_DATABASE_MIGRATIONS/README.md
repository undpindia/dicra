# DiCRA - Database Setup
The database engine for DiCRA is PostgreSQL and PostGIS extension should be enabled.
### How to run Database Migration
To run Database migration we are using Alembic. Alembic is a lightweight database migration tool for usage with the SQLAlchemy Database Toolkit for Python.
Do the following steps to run Database Migration
- Install alembic and its dependencies.
- Change Database connection url  on sqlalchemy.url in alembic.ini
- To run  database migration 
  ```sh
  alembic upgrade head
  ```
  It will create  all the necessary tables.
