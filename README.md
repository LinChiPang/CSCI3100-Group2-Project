# CSCI3100-Group2-Project

Project webpage: https://calm-woodland-37162-a0850eb97b8f.herokuapp.com/

Members: [chw1016](https://github.com/chw1016), [EricYeung1579](https://github.com/ericyeung1579-source), [LouisWonge1234567](https://github.com/LouisWonge1234567), [LinChiPang](https://github.com/LinChiPang)

## Local development

See `docs/RUNBOOK.md` for setup (PostgreSQL + commands to run server and tests).

## Production-like implementation docs

- Scope and demo checkpoints: `docs/MVP_SCOPE.md`
- Frontend API contract: `docs/API_CONTRACT.md`
- Deployment setup (public cloud + managed Postgres): `docs/DEPLOYMENT.md`
- Final submission checklist and ownership template: `docs/SUBMISSION_CHECKLIST.md`

## Advanced features (N-1)

- **Real-time**: ActionCable notifications demo at `/notifications`
- **Payments (mock)**: Stripe-like checkout demo at `/payments` (records `Transaction`)
- **Analytics**: dashboard at `/admin/analytics`
- **Fuzzy search**: suggestions demo at `/search` (PostgreSQL `pg_trgm` + fallback)

## Feature ownership

Fill this table before final submission.

| Feature Name | Primary Developer | Secondary Developer | Notes |
|---|---|---|---|
| User Auth & Roles |  |  | Devise + JWT + policy checks |
| Marketplace Listings |  |  | CRUD + status workflow |
| Fuzzy Search |  |  | `pg_trgm` + fallback |
| Real-time Notifications |  |  | ActionCable |
| Mock Payment + Analytics |  |  | Transaction + dashboard |