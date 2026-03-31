# CSCI3100-Group2-Project

Project webpage: https://calm-woodland-37162-a0850eb97b8f.herokuapp.com/

Members: [chw1016](https://github.com/chw1016), [EricYeung1579](https://github.com/ericyeung1579-source), [LouisWonge1234567](https://github.com/LouisWonge1234567), [LinChiPang](https://github.com/LinChiPang)

## Local development

See `docs/RUNBOOK.md` for setup (PostgreSQL + commands to run server and tests).

## Advanced features (N-1)

- **Real-time**: ActionCable notifications demo at `/notifications`
- **Payments (mock)**: Stripe-like checkout demo at `/payments` (records `Transaction`)
- **Analytics**: dashboard at `/admin/analytics`
- **Fuzzy search**: suggestions demo at `/search` (PostgreSQL `pg_trgm` + fallback)