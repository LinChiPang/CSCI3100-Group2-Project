function cableBaseUrl() {
  const explicitCableUrl = (import.meta.env.VITE_CABLE_URL as string | undefined)?.trim();
  if (explicitCableUrl) return explicitCableUrl;

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (apiBaseUrl) {
    const url = new URL(apiBaseUrl, window.location.origin);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/cable";
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/cable`;
}

export function buildCableUrl(token: string) {
  const url = new URL(cableBaseUrl(), window.location.origin);
  url.searchParams.set("token", token);
  return url.toString();
}
