import { createConsumer } from "@rails/actioncable"

function cableUrl() {
  const url = new URL("/cable", window.location.href)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"

  const token = window.localStorage.getItem("auth_token")
  if (token) url.searchParams.set("token", token)

  return url.toString()
}

export default createConsumer(cableUrl())
