# CSCI3100-Group2-Project

Project webpage: https://calm-woodland-37162-a0850eb97b8f.herokuapp.com/

Members: [chw1016](https://github.com/chw1016), [EricYeung1579](https://github.com/ericyeung1579-source), [LouisWonge1234567](https://github.com/LouisWonge1234567), [LinChiPang](https://github.com/LinChiPang)

## Advanced feature checklist

- ActionCable notifications: `/notifications`
- Stripe mock checkout: `/payments`
- Fuzzy search suggestions: `/search` and `/search/suggestions?q=...`
- Analytics dashboard (Chart.js): `/admin/analytics`

## Coverage and test

- Run coverage with:
  - `COVERAGE=true bundle exec rspec`
- Coverage gate is set to `80%` in `spec/spec_helper.rb`.

## Feature ownership

| Feature Area | Owner | Notes |
| --- | --- | --- |
| ActionCable notifications | `chw1016` | Real-time notification demo |
| Stripe mock payment | `chw1016` | Mock checkout endpoint + page |
| Fuzzy search suggestions | `chw1016` | Suggestion endpoint + UI |
| Analytics dashboard | `chw1016` | Admin dashboard with Chart.js |
| Authentication and policy | `LouisWonge1234567` | Branch-dependent integration |
| Frontend flows and filters | `EricYeung1579` | Branch-dependent integration |
| Community/rule models | `LinChiPang` | Branch-dependent integration |