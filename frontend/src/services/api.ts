/**
 * Frontend API surface for the marketplace SPA.
 *
 * Env:
 * - VITE_USE_MOCKS: "false" to call Rails; anything else uses `mockApi`.
 * - VITE_API_BASE_URL: optional origin of the Rails app when not using mocks
 *   (defaults to same-origin requests when omitted).
 */
import axios from "axios";
import type {
  Community,
  CommunityRule,
  FilterParams,
  Item,
  User,
} from "../types/marketplace";
import * as mockApi from "./mockApi";

// Shape returned by ItemSerializer (nested user + community)
type RawItem = {
  id: number;
  title: string;
  description: string | null;
  price: string; // Rails decimal comes as string
  status: "available" | "reserved" | "sold";
  category: string | null;
  reserved_by_id: number | null;
  created_at: string;
  updated_at: string;
  user: { id: number; email: string };
  community: { id: number; slug: string; name: string };
};

function normalizeItem(raw: RawItem): Item {
  return {
    id: raw.id,
    community_id: raw.community.id,
    user_id: raw.user.id,
    reserved_by_id: raw.reserved_by_id ?? null,
    seller_name: raw.user.email.split("@")[0],
    title: raw.title,
    description: raw.description,
    price: parseFloat(raw.price),
    status: raw.status,
    category: raw.category ?? null,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";
const apiBaseUrl = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "").trim();

const client = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
});

function authHeaderShouldBeSkipped(requestUrl: string): boolean {
  const path = requestUrl.split("?")[0] ?? requestUrl;
  return path.endsWith("/users/login") ||
    path.endsWith("/users/login.json") ||
    path.endsWith("/users") ||
    path.endsWith("/users.json");
}

// Add JWT token to request headers if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  const requestUrl = config.url ?? "";
  if (token && !authHeaderShouldBeSkipped(requestUrl)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// When the server returns 401 on a non-auth endpoint, clear stale credentials and redirect to login
client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number }; config?: { url?: string } }).response?.status === 401
    ) {
      const requestUrl = (error as { config?: { url?: string } }).config?.url ?? "";
      // Don't redirect when the auth endpoints themselves return 401 (wrong credentials / already logged in)
      const isAuthEndpoint =
        requestUrl.includes("/users/login") ||
        requestUrl.includes("/users/login.json") ||
        requestUrl.includes("/users/logout") ||
        requestUrl.includes("/users/logout.json") ||
        requestUrl === "/users" ||
        requestUrl === "/users.json";
      // Only redirect if the user was supposed to be authenticated (had a stored token)
      const hadToken = !!localStorage.getItem("auth_token");
      if (!isAuthEndpoint && hadToken) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

async function guardRealApi() {
  if (useMocks) return;
}

// ===== Auth Endpoints =====
export async function register(
  email: string,
  password: string,
  passwordConfirmation: string,
  communityId: number,
  username: string,
): Promise<{ user: User; token: string }> {
  if (useMocks) return mockApi.register(email, password, passwordConfirmation, communityId, username);
  await guardRealApi();

  const res = await client.post("/users.json", {
    user: { email, password, password_confirmation: passwordConfirmation, community_id: communityId, username },
  });

  return {
    user: res.data.user as User,
    token: res.data.token as string,
  };
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  if (useMocks) return mockApi.login(email, password);
  await guardRealApi();

  const res = await client.post("/users/login.json", {
    user: { email, password },
  });

  return {
    user: res.data.user as User,
    token: res.data.token as string,
  };
}

export async function logout(): Promise<void> {
  if (useMocks) {
    await mockApi.logout();
    return;
  }
  await guardRealApi();
  try {
    await client.delete("/users/logout.json");
  } finally {
    localStorage.removeItem("auth_token");
  }
}

// ===== Community Endpoints =====
export async function getCommunities(): Promise<Community[]> {
  if (useMocks) return mockApi.getCommunities();
  await guardRealApi();
  const res = await client.get("/communities");
  return res.data as Community[];
}

export async function getCommunityRule(communitySlug: string): Promise<CommunityRule | null> {
  if (useMocks) return mockApi.getCommunityRule(communitySlug);
  await guardRealApi();
  const res = await client.get(`/communities/${encodeURIComponent(communitySlug)}/community_rule`);
  return res.data as CommunityRule;
}

export async function updateCommunityRule(
  communitySlug: string,
  params: Partial<Pick<CommunityRule, "max_price" | "max_active_listings" | "posting_enabled" | "allowed_categories">>,
): Promise<CommunityRule> {
  if (useMocks) return mockApi.updateCommunityRule(communitySlug, params);
  await guardRealApi();
  const res = await client.patch(
    `/communities/${encodeURIComponent(communitySlug)}/community_rule`,
    { community_rule: params },
  );
  return res.data as CommunityRule;
}

// ===== Item Endpoints =====
export async function getListings(
  communitySlug: string,
  filters: FilterParams,
): Promise<Item[]> {
  if (useMocks) return mockApi.getListings(communitySlug, filters);
  await guardRealApi();

  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.minPrice !== undefined) params.set("min_price", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("max_price", String(filters.maxPrice));
  filters.statuses?.forEach((status) => params.append("status", status));
  filters.categories?.forEach((category) => params.append("category", category));

  const res = await client.get("/items", { params });
  return (res.data as RawItem[]).map(normalizeItem);
}

export async function createListing(
  title: string,
  description: string,
  price: number,
  category: string,
): Promise<Item> {
  if (useMocks) return mockApi.createListing(title, description, price, category);
  await guardRealApi();
  const res = await client.post("/items", {
    item: { title, description, price, category },
  });
  return normalizeItem(res.data as RawItem);
}

export async function getItemDetail(itemId: number): Promise<Item> {
  if (useMocks) return mockApi.getItemDetail(itemId);
  await guardRealApi();
  const res = await client.get(`/items/${itemId}`);
  return normalizeItem(res.data as RawItem);
}

export async function reserveItem(itemId: number): Promise<Item> {
  if (useMocks) return mockApi.reserveItem(itemId);
  await guardRealApi();
  const res = await client.patch(`/items/${itemId}/reserve`);
  return normalizeItem(res.data as RawItem);
}

export async function sellItem(itemId: number): Promise<Item> {
  if (useMocks) return mockApi.sellItem(itemId);
  await guardRealApi();
  const res = await client.patch(`/items/${itemId}/sell`);
  return normalizeItem(res.data as RawItem);
}

export async function updateItem(
  itemId: number,
  title: string,
  description: string,
  price: number,
  category: string,
): Promise<Item> {
  if (useMocks) return mockApi.updateItem(itemId, title, description, price, category);
  await guardRealApi();
  const res = await client.patch(`/items/${itemId}`, {
    item: { title, description, price, category },
  });
  return normalizeItem(res.data as RawItem);
}

export async function deleteItem(itemId: number): Promise<void> {
  if (useMocks) return mockApi.deleteItem(itemId);
  await guardRealApi();
  await client.delete(`/items/${itemId}`);
}

// ===== Admin Endpoints =====
export interface AnalyticsData {
  total_transactions: number;
  total_gmv_hkd: number;
  daily_labels: string[];
  daily_counts: number[];
  daily_gmv_hkd: number[];
  recent_transactions: {
    id: number;
    item_name: string;
    amount_hkd: number;
    provider_ref: string;
    status: string;
    created_at: string;
  }[];
}

export async function getAnalytics(): Promise<AnalyticsData> {
  if (useMocks) return mockApi.getAnalytics();
  await guardRealApi();
  const res = await client.get("/admin/analytics");
  return res.data as AnalyticsData;
}

export interface CheckoutResult {
  message: string;
  transaction: {
    id: number;
    item_name: string;
    amount_hkd: number;
    provider_ref: string;
    status: string;
  };
}

export async function mockCheckout(itemName: string, amount: number): Promise<CheckoutResult> {
  if (useMocks) return mockApi.mockCheckout(itemName, amount);
  await guardRealApi();
  const res = await client.post("/payments/mock_checkout", { item_name: itemName, amount });
  return res.data as CheckoutResult;
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (useMocks) return mockApi.getSearchSuggestions(query);
  await guardRealApi();
  if (!query.trim()) return [];
  const res = await client.get("/search/suggestions", { params: { q: query } });
  return (res.data as { suggestions: string[] }).suggestions;
}
