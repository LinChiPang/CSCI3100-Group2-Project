## Runbook (dev)

### Prereqs
- Ruby (RubyInstaller on Windows) + Bundler
- PostgreSQL running locally

### Install deps

```powershell
bundle install
```

Frontend build deps:

```powershell
cd frontend
npm ci
cd ..
```

### Database setup

```powershell
ruby bin\rails db:create
ruby bin\rails db:migrate
```

By default, Rails now connects to local PostgreSQL using the local socket and your current OS user. If your PostgreSQL setup requires explicit credentials, set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, and `DB_PASSWORD` before running Rails.

### Start server

Rebuild the frontend before starting Rails whenever anything under `frontend/` changes:

```powershell
bin/build-frontend
```

```powershell
bundle exec rails server
```

If Windows tries to “open” `bin\rails`, use:

```powershell
ruby bin\rails server
```

Open:
- `/` (React SPA home)
- `/payments` (mock checkout + Transaction records)
- `/admin/analytics` (analytics dashboard)
- `/search` (fuzzy suggestions)
- `/notifications` (ActionCable demo)

### Run tests (same as CI)

```powershell
ruby bin\rails db:test:prepare
bundle exec rspec
bundle exec cucumber
```
