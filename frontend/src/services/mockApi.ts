import type {
  Community,
  CommunityRule,
  FilterParams,
  Item,
  ItemStatus,
  User,
} from "../types/marketplace";

const communities: Community[] = [
  {
    id: 1,
    slug: "cuhk-shatin",
    name: "CUHK Shatin",
    community_rule: {
      community_id: 1,
      max_price: 500,
      max_active_listings: 5,
      posting_enabled: true,
      allowed_categories: ["electronics", "furniture", "textbook"],
    },
  },
  {
    id: 2,
    slug: "cuhk-kowloon",
    name: "CUHK Kowloon",
    community_rule: {
      community_id: 2,
      max_price: 800,
      max_active_listings: 8,
      posting_enabled: true,
      allowed_categories: ["electronics", "furniture", "textbook"],
    },
  },
];

let items: Item[] = [
  {
    id: 101,
    community_id: 1,
    user_id: 1,
    title: "Calculus Textbook (Vol. 1)",
    description: "Good condition. Includes practice problems.",
    price: 180,
    status: "available",
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-20T10:00:00Z",
  },
  {
    id: 102,
    community_id: 1,
    user_id: 2,
    title: "Introduction to Algorithms - 3rd Ed",
    description: "Minor highlighting. No missing pages.",
    price: 280,
    status: "available",
    created_at: "2026-03-20T10:05:00Z",
    updated_at: "2026-03-20T10:05:00Z",
  },
  {
    id: 103,
    community_id: 1,
    user_id: 3,
    title: "Math Formula Sheet (Printed)",
    description: "Handy cheat sheet for finals.",
    price: 50,
    status: "available",
    created_at: "2026-03-20T10:10:00Z",
    updated_at: "2026-03-20T10:10:00Z",
  },
  {
    id: 104,
    community_id: 1,
    user_id: 4,
    title: "Wooden Desk Lamp",
    description: "Warm light, adjustable neck.",
    price: 75,
    status: "reserved",
    created_at: "2026-03-20T10:15:00Z",
    updated_at: "2026-03-20T10:15:00Z",
  },
  {
    id: 105,
    community_id: 1,
    user_id: 5,
    title: "Study Chair (Ergonomic)",
    description: "Comfortable for long hours.",
    price: 64,
    status: "available",
    created_at: "2026-03-20T10:20:00Z",
    updated_at: "2026-03-20T10:20:00Z",
  },
  {
    id: 106,
    community_id: 1,
    user_id: 6,
    title: "2-Drawer Storage Cabinet",
    description: "Sturdy cabinet with smooth drawers.",
    price: 120,
    status: "sold",
    created_at: "2026-03-20T10:25:00Z",
    updated_at: "2026-03-20T10:25:00Z",
  },
  {
    id: 107,
    community_id: 1,
    user_id: 7,
    title: "Wireless Mouse (USB-C)",
    description: "Rechargeable. Works great.",
    price: 32,
    status: "available",
    created_at: "2026-03-20T10:30:00Z",
    updated_at: "2026-03-20T10:30:00Z",
  },
  {
    id: 108,
    community_id: 1,
    user_id: 8,
    title: "Mechanical Keyboard (Blue Switch)",
    description: "No dents. Clean keycaps.",
    price: 59,
    status: "available",
    created_at: "2026-03-20T10:35:00Z",
    updated_at: "2026-03-20T10:35:00Z",
  },
  {
    id: 109,
    community_id: 1,
    user_id: 9,
    title: "USB-C Hub (7-in-1)",
    description: "HDMI + SD card + USB ports.",
    price: 42,
    status: "reserved",
    created_at: "2026-03-20T10:40:00Z",
    updated_at: "2026-03-20T10:40:00Z",
  },
  {
    id: 110,
    community_id: 1,
    user_id: 10,
    title: "Physics Workbook",
    description: "Chapter summaries and problem sets.",
    price: 90,
    status: "available",
    created_at: "2026-03-20T10:45:00Z",
    updated_at: "2026-03-20T10:45:00Z",
  },
  {
    id: 201,
    community_id: 2,
    user_id: 11,
    title: "Chemistry Lab Manual",
    description: "Lab procedures and worksheets.",
    price: 160,
    status: "available",
    created_at: "2026-03-21T10:00:00Z",
    updated_at: "2026-03-21T10:00:00Z",
  },
  {
    id: 202,
    community_id: 2,
    user_id: 12,
    title: "Linear Algebra Notes",
    description: "Clean notes for matrix & eigenvalues.",
    price: 65,
    status: "available",
    created_at: "2026-03-21T10:05:00Z",
    updated_at: "2026-03-21T10:05:00Z",
  },
  {
    id: 203,
    community_id: 2,
    user_id: 13,
    title: "Office Chair (Breathable)",
    description: "Used lightly. Great ventilation.",
    price: 74,
    status: "sold",
    created_at: "2026-03-21T10:10:00Z",
    updated_at: "2026-03-21T10:10:00Z",
  },
  {
    id: 204,
    community_id: 2,
    user_id: 14,
    title: "Standing Desk Converter",
    description: "Make your desk standing-friendly.",
    price: 98,
    status: "available",
    created_at: "2026-03-21T10:15:00Z",
    updated_at: "2026-03-21T10:15:00Z",
  },
  {
    id: 205,
    community_id: 2,
    user_id: 15,
    title: "Bluetooth Speaker",
    description: "Loud and clear sound. Includes cable.",
    price: 220,
    status: "reserved",
    created_at: "2026-03-21T10:20:00Z",
    updated_at: "2026-03-21T10:20:00Z",
  },
  {
    id: 206,
    community_id: 2,
    user_id: 16,
    title: "Power Bank 10000mAh",
    description: "Fast charge supported.",
    price: 68,
    status: "available",
    created_at: "2026-03-21T10:25:00Z",
    updated_at: "2026-03-21T10:25:00Z",
  },
  {
    id: 207,
    community_id: 2,
    user_id: 17,
    title: "Laptop Stand (Aluminum)",
    description: "Adjustable angle. Fits most laptops.",
    price: 51,
    status: "available",
    created_at: "2026-03-21T10:30:00Z",
    updated_at: "2026-03-21T10:30:00Z",
  },
  {
    id: 208,
    community_id: 2,
    user_id: 18,
    title: "Discrete Mathematics Text",
    description: "Graphs, logic, and proofs.",
    price: 199,
    status: "available",
    created_at: "2026-03-21T10:35:00Z",
    updated_at: "2026-03-21T10:35:00Z",
  },
  {
    id: 209,
    community_id: 2,
    user_id: 19,
    title: "USB Flash Drive 64GB",
    description: "Reliable transfer speeds.",
    price: 24,
    status: "sold",
    created_at: "2026-03-21T10:40:00Z",
    updated_at: "2026-03-21T10:40:00Z",
  },
  {
    id: 210,
    community_id: 2,
    user_id: 20,
    title: "Study Table (Small)",
    description: "Compact table for dorm rooms.",
    price: 43,
    status: "available",
    created_at: "2026-03-21T10:45:00Z",
    updated_at: "2026-03-21T10:45:00Z",
  },
];

let mockCurrentUser: User | null = null;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function applyFilters(communityId: number, filter: FilterParams): Item[] {
  const search = filter.search ? normalize(filter.search) : undefined;
  const statusSet = new Set<ItemStatus>(filter.statuses ?? []);
  const minPrice = filter.minPrice;
  const maxPrice = filter.maxPrice;

  return items.filter((it) => {
    if (it.community_id !== communityId) return false;

    if (search && search.length > 0) {
      const haystack = normalize(`${it.title} ${it.description ?? ""}`);
      if (!haystack.includes(search)) return false;
    }

    if (statusSet.size > 0 && !statusSet.has(it.status)) return false;
    if (minPrice !== undefined && it.price < minPrice) return false;
    if (maxPrice !== undefined && it.price > maxPrice) return false;
    return true;
  });
}

// ===== Auth =====
export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  await sleep(300);
  
  // Mock: accept any CUHK email
  if (!email.endsWith("@cuhk.edu.hk")) {
    throw new Error("Invalid email or password");
  }

  mockCurrentUser = {
    id: 999,
    email,
    community_id: 1, // Default to first community
  };

  return {
    user: mockCurrentUser,
    token: `mock_token_${Date.now()}`,
  };
}

export async function logout(): Promise<void> {
  await sleep(100);
  mockCurrentUser = null;
}

// ===== Communities =====
export async function getCommunities(): Promise<Community[]> {
  await sleep(200);
  return communities;
}

export async function getCommunityRule(communitySlug: string): Promise<CommunityRule | null> {
  await sleep(180);
  const community = communities.find((c) => c.slug === communitySlug);
  return community?.community_rule ?? null;
}

// ===== Items =====
export async function getListings(communitySlug: string, filters: FilterParams): Promise<Item[]> {
  await sleep(250);
  const community = communities.find((c) => c.slug === communitySlug);
  if (!community) throw new Error("Community not found");
  
  const filtered = applyFilters(community.id, filters);
  return filtered;
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
  it.updated_at = new Date().toISOString();
  return it;
}

export async function sellItem(itemId: number): Promise<Item> {
  await sleep(260);
  const it = items.find((x) => x.id === itemId);
  if (!it) throw new Error("Item not found");
  if (it.status !== "reserved") throw new Error(`Cannot sell item not in reserved status`);
  it.status = "sold";
  it.updated_at = new Date().toISOString();
  return it;
}


