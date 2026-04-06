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

By default, Rails now tries local PostgreSQL without forcing a host, username, or password. This works well on many macOS/Linux setups that use local socket auth and may also work on some Windows setups, but it is not universal.

If your PostgreSQL server requires TCP login or explicit credentials, set these before running setup or Rails:

```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password"
```

PowerShell note: the equivalent env vars on macOS/Linux shells are `DB_HOST`, `DB_PORT`, `DB_USERNAME`, and `DB_PASSWORD`.

### Start server

Rebuild the frontend before starting Rails whenever anything under `frontend/` changes:

Canonical cross-platform rebuild command:

```powershell
cd frontend
npm run build
cd ..
```

Optional shortcut on macOS/Linux or Git Bash:

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
