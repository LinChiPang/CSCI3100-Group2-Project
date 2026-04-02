## Database Configuration Guide

This project uses PostgreSQL in all environments.

The database connection has been updated to read credentials from environment variables instead of storing them directly in [`config/database.yml`](/home/boilingthing/instant/CSCI3100-Group2-Project/config/database.yml). In local development and test, those variables are loaded from `.env` by `dotenv-rails`.

### Why this changed

- Keeps database credentials out of version-controlled config.
- Lets each teammate use their own local PostgreSQL username and password.
- Keeps production aligned with Rails best practice by using `DATABASE_URL`.

### Local development setup

1. Install project dependencies:

```bash
bundle install
```

2. Create a `.env` file in the project root if you do not already have one:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
RAILS_MAX_THREADS=5
```

3. Make sure PostgreSQL is running and that the username and password in `.env` can connect to your local server.

4. Create and migrate the databases:

```bash
bin/rails db:create
bin/rails db:migrate
```

5. Run the test database setup when needed:

```bash
bin/rails db:test:prepare
```

### Environment variables used

- `DB_HOST`: PostgreSQL host for development and test. Defaults to `localhost`.
- `DB_PORT`: PostgreSQL port for development and test. Defaults to `5432`.
- `DB_USERNAME`: PostgreSQL username for development and test. Defaults to `postgres`.
- `DB_PASSWORD`: PostgreSQL password for development and test. Defaults to an empty string.
- `RAILS_MAX_THREADS`: Used to set the Active Record connection pool size. Defaults to `5`.
- `DATABASE_URL`: Used in production to connect Rails to the deployed PostgreSQL instance.

### How the environments work

- `development` uses `csci3100_group2_project_development` and reads host, port, username, and password from `.env`.
- `test` uses `csci3100_group2_project_test` and reads the same connection settings from `.env`.
- `production` reads from `DATABASE_URL`, which should be provided by the hosting platform or deployment environment.

### Team workflow notes

- Do not commit real database credentials to `config/database.yml`.
- Do not commit a personal `.env` file if it contains secrets.
- If your local PostgreSQL credentials differ from a teammate's setup, only `.env` should need to change.
- If you rotate your local password or switch PostgreSQL users, update `.env` and restart the Rails server.

### Troubleshooting

- If Rails cannot connect, confirm PostgreSQL is running and the values in `.env` match a valid PostgreSQL user.
- If `bundle exec rails` does not seem to pick up `.env` changes, restart the Rails process.
- If production cannot connect, verify that `DATABASE_URL` is set correctly in the deployment environment.
