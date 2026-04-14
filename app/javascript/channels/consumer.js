import { createConsumer } from "@rails/actioncable"

// Get JWT token from localStorage (set during login)
const token = localStorage.getItem("auth_token")

// Create consumer with JWT token passed as query parameter for WebSocket authentication
const consumer = createConsumer(token ? `/cable?token=${encodeURIComponent(token)}` : "/cable")

export default consumer

