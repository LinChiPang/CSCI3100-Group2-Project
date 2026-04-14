import { createConsumer, type Consumer } from "@rails/actioncable";

function defaultCableUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/cable`;
}

export function buildCableUrl(token: string) {
  const configuredUrl = ((import.meta.env.VITE_CABLE_URL as string | undefined) ?? "").trim();
  const cableUrl = configuredUrl || defaultCableUrl();
  const separator = cableUrl.includes("?") ? "&" : "?";

  return `${cableUrl}${separator}token=${encodeURIComponent(token)}`;
}

export function createAuthenticatedCableConsumer(token: string): Consumer {
  return createConsumer(buildCableUrl(token));
}
