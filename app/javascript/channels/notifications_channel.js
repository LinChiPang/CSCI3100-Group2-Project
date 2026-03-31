import consumer from "channels/consumer"

consumer.subscriptions.create("NotificationsChannel", {
  received(data) {
    const list = document.getElementById("notifications-list")
    if (!list) return

    if (list.children.length === 1 && list.children[0].textContent === "No notifications yet.") {
      list.innerHTML = ""
    }

    const item = document.createElement("li")
    item.textContent = `[${data.sent_at}] ${data.message}`
    list.prepend(item)
  }
})

document.addEventListener("turbo:load", () => {
  const form = document.getElementById("notifications-form")
  if (!form || form.dataset.bound === "true") return

  form.dataset.bound = "true"
  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const token = document.querySelector("meta[name='csrf-token']")?.getAttribute("content")
    const formData = new FormData(form)

    await fetch(form.action, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token || "",
        Accept: "application/json"
      },
      body: formData
    })
  })
})

