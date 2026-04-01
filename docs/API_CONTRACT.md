## Frontend API Contract (Rails backend)

Base URL (local): `http://127.0.0.1:3000`

Authorization header for protected endpoints:

`Authorization: Bearer <jwt_token>`

---

### Auth

- `POST /users` (register)
  - Body:
    ```json
    { "user": { "email": "student@cuhk.edu.hk", "password": "Password123!", "password_confirmation": "Password123!", "community_id": 1 } }
    ```
  - Success: `201`, returns `{ user, token }` or confirmation message.

- `POST /users/login`
  - Body:
    ```json
    { "user": { "email": "student@cuhk.edu.hk", "password": "Password123!" } }
    ```
  - Success: `200`, returns `{ user, token }`.

- `DELETE /users/logout`
  - Requires auth header.
  - Success: `200`, returns logout message.

---

### Items

- `GET /items`
  - Requires auth.
  - Query params:
    - `status`: `available|reserved|sold`
    - `min_price`, `max_price`
    - `q`: keyword for title/description

- `GET /items/:id`
  - Requires auth.
  - Cross-community item returns `404`.

- `POST /items`
  - Requires auth.
  - Body:
    ```json
    { "item": { "title": "Desk Lamp", "description": "Good condition", "price": 120 } }
    ```
  - `community` and owner are derived from current user.

- `PATCH /items/:id`
  - Requires auth.
  - Owner only.

- `DELETE /items/:id`
  - Requires auth.
  - Owner only.

- `PATCH /items/:id/reserve`
  - Requires auth.
  - Non-owner user in same community only.

- `PATCH /items/:id/sell`
  - Requires auth.
  - Owner only, and item must already be reserved.

---

### Advanced feature endpoints

- `GET /search` (demo page)
- `GET /search/suggestions?q=lmp` (JSON suggestions)
- `GET /notifications` (ActionCable demo page)
- `POST /notifications/broadcast` (send notification)
- `GET /payments` + `POST /payments/mock_checkout`
- `GET /admin/analytics`

---

### Common response patterns

- Validation failure: `422` with `{ errors: [...] }`
- Unauthorized or bad token: `401`
- Forbidden action: `403`
- Not found / blocked by tenant boundary: `404`
