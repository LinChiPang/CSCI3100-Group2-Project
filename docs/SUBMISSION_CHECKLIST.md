## Final Submission Checklist

### Required deliverables

- [ ] GitHub repository link
- [ ] Public SaaS URL
- [ ] 5-minute demo video URL
- [ ] README includes setup guide + implemented features + ownership table
- [ ] README includes SimpleCov screenshot

### Technical quality gates

- [ ] `bundle exec rspec` passes
- [ ] `bundle exec cucumber` passes
- [ ] GitHub Actions CI on `dev` is green
- [ ] Coverage stays above 80%
- [ ] Tenant isolation test cases pass

### Demo script checklist

- [ ] Register/login with CUHK email
- [ ] Create listing
- [ ] Search/filter listing
- [ ] Reserve item as a different user
- [ ] Mark sold by owner
- [ ] Show fuzzy suggestions
- [ ] Show ActionCable notifications
- [ ] Show payments and analytics pages

### Feature ownership table template

| Feature Name | Primary Developer | Secondary Developer | Notes |
|---|---|---|---|
| User Auth & Roles |  |  | Devise + JWT + policy checks |
| Marketplace Listings |  |  | CRUD + status workflow |
| Fuzzy Search |  |  | `pg_trgm` + fallback |
| Real-time Notifications |  |  | ActionCable |
| Mock Payment + Analytics |  |  | Transaction demo flow |
