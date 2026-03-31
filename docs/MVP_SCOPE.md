## MVP Scope and Demo Checkpoints

This file freezes the final demo path for the production-like submission.

### Primary demo user journey

1. Register a CUHK account under a community.
2. Login and receive auth token.
3. Create a listing in the same community.
4. Open listing feed and apply search/filter.
5. Reserve listing as another user in the same community.
6. Mark the reserved listing as sold by the owner.
7. Show advanced features:
   - Fuzzy search suggestions (`/search`)
   - Notification broadcast (`/notifications`)
   - Payment and transaction record (`/payments`)
   - Analytics dashboard (`/admin/analytics`)

### Demo checkpoints

- Auth endpoints work: `/users` and `/users/login`.
- Tenant isolation works: cross-community listing access returns `404`.
- Status workflow is enforced: `available -> reserved -> sold`.
- CI test stack is green: RSpec + Cucumber + GitHub Actions.
- Public deployment URL is reachable and stable.
