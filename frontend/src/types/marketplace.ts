export type Community = {
  id: number;
  slug: string;
  name: string;
};

export type ItemStatus = "available" | "reserved" | "sold";

export type Item = {
  id: number;
  community_slug: string;
  title: string;
  description: string;
  price_cents: number;
  status: ItemStatus;
  category: string;
  seller_name: string;
  image_url?: string;
  reserved_by?: string;
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

