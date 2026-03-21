import axios from "axios";
import type {
  Community,
  FilterParams,
  Item,
  ListingsResponse,
} from "../types/marketplace";
import * as mockApi from "./mockApi";

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

const client = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

async function guardRealApi() {
  if (useMocks) return;
  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not set. Either set it or keep VITE_USE_MOCKS=true.");
  }
}

export async function getCommunities(): Promise<Community[]> {
  if (useMocks) return mockApi.getCommunities();
  await guardRealApi();
  const res = await client.get("/api/v1/communities");
  return res.data as Community[];
}

export async function getListings(
  communitySlug: string,
  filters: FilterParams,
): Promise<ListingsResponse> {
  if (useMocks) return mockApi.getListings(communitySlug, filters);
  await guardRealApi();

  const params: Record<string, unknown> = {};
  if (filters.search) params.q = filters.search;
  if (filters.categories && filters.categories.length > 0) params.category = filters.categories[0];
  if (filters.minPrice !== undefined) params.min_price = filters.minPrice;
  if (filters.maxPrice !== undefined) params.max_price = filters.maxPrice;
  if (filters.statuses && filters.statuses.length > 0) params.status = filters.statuses[0];

  const res = await client.get(
    `/api/v1/communities/${encodeURIComponent(communitySlug)}/items`,
    { params },
  );
  return res.data as ListingsResponse;
}

export async function getItemDetail(itemId: number): Promise<Item> {
  if (useMocks) return mockApi.getItemDetail(itemId);
  await guardRealApi();
  const res = await client.get(`/api/v1/items/${itemId}`);
  return res.data as Item;
}

export async function reserveItem(itemId: number): Promise<Item> {
  if (useMocks) return mockApi.reserveItem(itemId);
  await guardRealApi();
  const res = await client.post(`/api/v1/items/${itemId}/reserve`);
  return res.data as Item;
}

export async function buyItem(itemId: number): Promise<Item> {
  if (useMocks) return mockApi.buyItem(itemId);
  await guardRealApi();
  const res = await client.post(`/api/v1/items/${itemId}/buy`);
  return res.data as Item;
}

