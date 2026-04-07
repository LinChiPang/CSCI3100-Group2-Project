export type Community = {
  id: number;
  slug: string;
  name: string;
  community_rule?: CommunityRule;
};

export type ItemStatus = "available" | "reserved" | "sold";

export type CommunityRule = {
  community_id: number;
  max_price: number | null;
  max_active_listings: number;
  posting_enabled: boolean;
  allowed_categories: string[];
};

export type Item = {
  id: number;
  community_id: number;
  user_id: number;
  reserved_by_id: number | null;
  seller_name: string;
  title: string;
  description: string | null;
  price: number;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  email: string;
  community_id: number;
  role?: string;
};

export type FilterParams = {
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  statuses?: ItemStatus[];
};

export type ListingsResponse = {
  items: Item[];
  meta: {
    total: number;
    filters_applied: FilterParams;
  };
};

