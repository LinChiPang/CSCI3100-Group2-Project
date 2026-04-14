## Deployment Guide (Render + Managed Postgres)

This is the recommended path for a class project with minimal ops overhead.

### 1) Create managed Postgres

- Create a Postgres instance on Render/Neon.
- Copy its connection string (`postgres://...`).

### 2) Deploy Rails app

- Create a new Web Service from this GitHub repository.
- Build command:
  - `bundle install && bundle exec rails assets:precompile`
- Start command:
  - `bundle exec rails server -p $PORT -e production`

### 3) Set environment variables

- `RAILS_ENV=production`
- `DATABASE_URL=<managed postgres url>`
- `RAILS_MASTER_KEY=<your master key>`
- `JWT_SECRET=<strong random string>`

### 4) Run migrations + seeds

Run once after deploy:

```bash
bundle exec rails db:migrate
bundle exec rails db:seed
```

### 5) Smoke test public URL

Verify these pages/paths:

- `/`
- `/payments`
- `/search`
- `/notifications`
- `/admin/analytics`
- `/users/login`
- `/up`

### 6) Production notes

- Never commit local DB passwords in `config/database.yml`.
- Keep using `DATABASE_URL` for cloud DB.
- If frontend is hosted on another domain, update CORS settings in:
  - `config/initializers/cors.rb`
