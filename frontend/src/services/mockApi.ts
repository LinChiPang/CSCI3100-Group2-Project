import type {
  Community,
  FilterParams,
  Item,
  ItemStatus,
  ListingsResponse,
} from "../types/marketplace";

const communities: Community[] = [
  { id: 1, slug: "cuhk-shatin", name: "CUHK Shatin" },
  { id: 2, slug: "cuhk-kowloon", name: "CUHK Kowloon" },
];

let items: Item[] = [
  {
    id: 101,
    community_slug: "cuhk-shatin",
    title: "Calculus Textbook (Vol. 1)",
    description: "Good condition. Includes practice problems.",
    price_cents: 18000,
    status: "available",
    category: "Textbook",
    seller_name: "Alice",
  },
  {
    id: 102,
    community_slug: "cuhk-shatin",
    title: "Introduction to Algorithms - 3rd Ed",
    description: "Minor highlighting. No missing pages.",
    price_cents: 28000,
    status: "available",
    category: "Textbook",
    seller_name: "Bob",
  },
  {
    id: 103,
    community_slug: "cuhk-shatin",
    title: "Math Formula Sheet (Printed)",
    description: "Handy cheat sheet for finals.",
    price_cents: 5000,
    status: "available",
    category: "Textbook",
    seller_name: "Carmen",
  },
  {
    id: 104,
    community_slug: "cuhk-shatin",
    title: "Wooden Desk Lamp",
    description: "Warm light, adjustable neck.",
    price_cents: 7500,
    status: "reserved",
    category: "Furniture",
    seller_name: "David",
    reserved_by: "mock_user",
  },
  {
    id: 105,
    community_slug: "cuhk-shatin",
    title: "Study Chair (Ergonomic)",
    description: "Comfortable for long hours.",
    price_cents: 6400,
    status: "available",
    category: "Furniture",
    seller_name: "Eva",
  },
  {
    id: 106,
    community_slug: "cuhk-shatin",
    title: "2-Drawer Storage Cabinet",
    description: "Sturdy cabinet with smooth drawers.",
    price_cents: 12000,
    status: "sold",
    category: "Furniture",
    seller_name: "Frank",
  },
  {
    id: 107,
    community_slug: "cuhk-shatin",
    title: "Wireless Mouse (USB-C)",
    description: "Rechargeable. Works great.",
    price_cents: 3200,
    status: "available",
    category: "Electronics",
    seller_name: "Grace",
  },
  {
    id: 108,
    community_slug: "cuhk-shatin",
    title: "Mechanical Keyboard (Blue Switch)",
    description: "No dents. Clean keycaps.",
    price_cents: 5900,
    status: "available",
    category: "Electronics",
    seller_name: "Henry",
  },
  {
    id: 109,
    community_slug: "cuhk-shatin",
    title: "USB-C Hub (7-in-1)",
    description: "HDMI + SD card + USB ports.",
    price_cents: 4200,
    status: "reserved",
    category: "Electronics",
    seller_name: "Iris",
    reserved_by: "mock_user",
  },
  {
    id: 110,
    community_slug: "cuhk-shatin",
    title: "Physics Workbook",
    description: "Chapter summaries and problem sets.",
    price_cents: 9000,
    status: "available",
    category: "Textbook",
    seller_name: "Jack",
  },
  {
    id: 201,
    community_slug: "cuhk-kowloon",
    title: "Chemistry Lab Manual",
    description: "Lab procedures and worksheets.",
    price_cents: 16000,
    status: "available",
    category: "Textbook",
    seller_name: "Kelly",
  },
  {
    id: 202,
    community_slug: "cuhk-kowloon",
    title: "Linear Algebra Notes",
    description: "Clean notes for matrix & eigenvalues.",
    price_cents: 6500,
    status: "available",
    category: "Textbook",
    seller_name: "Leo",
  },
  {
    id: 203,
    community_slug: "cuhk-kowloon",
    title: "Office Chair (Breathable)",
    description: "Used lightly. Great ventilation.",
    price_cents: 7400,
    status: "sold",
    category: "Furniture",
    seller_name: "Mia",
  },
  {
    id: 204,
    community_slug: "cuhk-kowloon",
    title: "Standing Desk Converter",
    description: "Make your desk standing-friendly.",
    price_cents: 9800,
    status: "available",
    category: "Furniture",
    seller_name: "Nora",
  },
  {
    id: 205,
    community_slug: "cuhk-kowloon",
    title: "Bluetooth Speaker",
    description: "Loud and clear sound. Includes cable.",
    price_cents: 22000,
    status: "reserved",
    category: "Electronics",
    seller_name: "Oscar",
    reserved_by: "mock_user",
  },
  {
    id: 206,
    community_slug: "cuhk-kowloon",
    title: "Power Bank 10000mAh",
    description: "Fast charge supported.",
    price_cents: 6800,
    status: "available",
    category: "Electronics",
    seller_name: "Paula",
  },
  {
    id: 207,
    community_slug: "cuhk-kowloon",
    title: "Laptop Stand (Aluminum)",
    description: "Adjustable angle. Fits most laptops.",
    price_cents: 5100,
    status: "available",
    category: "Furniture",
    seller_name: "Quinn",
  },
  {
    id: 208,
    community_slug: "cuhk-kowloon",
    title: "Discrete Mathematics Text",
    description: "Graphs, logic, and proofs.",
    price_cents: 19900,
    status: "available",
    category: "Textbook",
    seller_name: "Rita",
  },
  {
    id: 209,
    community_slug: "cuhk-kowloon",
    title: "USB Flash Drive 64GB",
    description: "Reliable transfer speeds.",
    price_cents: 2400,
    status: "sold",
    category: "Electronics",
    seller_name: "Sam",
  },
  {
    id: 210,
    community_slug: "cuhk-kowloon",
    title: "Study Table (Small)",
    description: "Compact table for dorm rooms.",
    price_cents: 4300,
    status: "available",
    category: "Furniture",
    seller_name: "Tina",
  },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function priceInCentsFromDollars(price?: number) {
  if (price === undefined) return undefined;
  return Math.round(price * 100);
}

function applyFilters(communitySlug: string, filter: FilterParams): Item[] {
  const search = filter.search ? normalize(filter.search) : undefined;
  const categories = filter.categories?.map(normalize);
  const statusSet = new Set<ItemStatus>(filter.statuses ?? []);
  const minCents = priceInCentsFromDollars(filter.minPrice);
  const maxCents = priceInCentsFromDollars(filter.maxPrice);

  return items.filter((it) => {
    if (it.community_slug !== communitySlug) return false;
    if (categories && categories.length > 0 && !categories.includes(normalize(it.category))) return false;

    if (search && search.length > 0) {
      const haystack = normalize(`${it.title} ${it.description} ${it.category} ${it.seller_name}`);
      if (!haystack.includes(search)) return false;
    }

    if (statusSet.size > 0 && !statusSet.has(it.status)) return false;
    if (minCents !== undefined && it.price_cents < minCents) return false;
    if (maxCents !== undefined && it.price_cents > maxCents) return false;
    return true;
  });
}

export async function getCommunities(): Promise<Community[]> {
  await sleep(200);
  return communities;
}

export async function getListings(
  communitySlug: string,
  filters: FilterParams,
): Promise<ListingsResponse> {
  await sleep(250);
  const filtered = applyFilters(communitySlug, filters);
  return {
    items: filtered,
    meta: {
      total: filtered.length,
      filters_applied: filters,
    },
  };
}

export async function getItemDetail(itemId: number): Promise<Item> {
  await sleep(220);
  const it = items.find((x) => x.id === itemId);
  if (!it) throw new Error("Item not found");
  return it;
}

export async function reserveItem(itemId: number): Promise<Item> {
  await sleep(260);
  const it = items.find((x) => x.id === itemId);
  if (!it) throw new Error("Item not found");
  if (it.status !== "available") throw new Error(`Cannot reserve item in status: ${it.status}`);
  it.status = "reserved";
  it.reserved_by = "mock_user";
  return it;
}

export async function buyItem(itemId: number): Promise<Item> {
  await sleep(260);
  const it = items.find((x) => x.id === itemId);
  if (!it) throw new Error("Item not found");
  if (it.status === "sold") throw new Error("Item already sold");
  it.status = "sold";
  return it;
}

