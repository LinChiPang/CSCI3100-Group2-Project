## Runbook (dev)

### Prereqs
- Ruby (RubyInstaller on Windows) + Bundler
- PostgreSQL running locally

### Install deps

```powershell
bundle install
```

### Database setup

```powershell
ruby bin\rails db:create
ruby bin\rails db:migrate
```

Database credentials for local development and test are now loaded from `.env`.
See [`docs/DATABASE_CONFIGURATION.md`](./DATABASE_CONFIGURATION.md) for the required variables and setup steps.

### Start server

```powershell
bundle exec rails server
```

If Windows tries to “open” `bin\rails`, use:

```powershell
ruby bin\rails server
```

Open:
- `/` (home)
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
