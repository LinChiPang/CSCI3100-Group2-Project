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
    slug: "chung-chi-college",
    name: "Chung Chi College",
    community_rule: { community_id: 1, max_price: 5000, max_active_listings: 8, posting_enabled: true, allowed_categories: ["books", "electronics", "furniture"] },
  },
  {
    id: 2,
    slug: "new-asia-college",
    name: "New Asia College",
    community_rule: { community_id: 2, max_price: 4000, max_active_listings: 6, posting_enabled: true, allowed_categories: ["books", "kitchen", "sports"] },
  },
  {
    id: 3,
    slug: "united-college",
    name: "United College",
    community_rule: { community_id: 3, max_price: 8000, max_active_listings: 10, posting_enabled: true, allowed_categories: ["books", "electronics", "furniture", "lifestyle"] },
  },
  {
    id: 4,
    slug: "shaw-college",
    name: "Shaw College",
    community_rule: { community_id: 4, max_price: 5000, max_active_listings: 8, posting_enabled: true, allowed_categories: ["books", "electronics", "furniture"] },
  },
  {
    id: 5,
    slug: "morningside-college",
    name: "Morningside College",
    community_rule: { community_id: 5, max_price: 6000, max_active_listings: 5, posting_enabled: true, allowed_categories: ["books", "electronics", "lifestyle"] },
  },
  {
    id: 6,
    slug: "sh-ho-college",
    name: "S.H. Ho College",
    community_rule: { community_id: 6, max_price: 4500, max_active_listings: 6, posting_enabled: true, allowed_categories: ["books", "furniture", "kitchen"] },
  },
  {
    id: 7,
    slug: "cw-chu-college",
    name: "CW Chu College",
    community_rule: { community_id: 7, max_price: 4000, max_active_listings: 6, posting_enabled: true, allowed_categories: ["books", "electronics", "sports"] },
  },
  {
    id: 8,
    slug: "wu-yee-sun-college",
    name: "Wu Yee Sun College",
    community_rule: { community_id: 8, max_price: 5000, max_active_listings: 7, posting_enabled: true, allowed_categories: ["books", "furniture", "lifestyle"] },
  },
  {
    id: 9,
    slug: "lee-woo-sing-college",
    name: "Lee Woo Sing College",
    community_rule: { community_id: 9, max_price: 5500, max_active_listings: 7, posting_enabled: true, allowed_categories: ["books", "electronics", "furniture"] },
  },
];

let items: Item[] = [
  {
    id: 101,
    community_id: 1,
    user_id: 1,
    seller_name: "alice",
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
    seller_name: "bob",
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
    seller_name: "carmen",
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
    seller_name: "david",
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
    seller_name: "eva",
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
    seller_name: "frank",
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
    seller_name: "grace",
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
    seller_name: "henry",
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
    seller_name: "iris",
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
    seller_name: "jack",
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
    seller_name: "kelly",
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
    seller_name: "leo",
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
    seller_name: "mia",
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
    seller_name: "nora",
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
    seller_name: "oscar",
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
    seller_name: "paula",
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
    seller_name: "quinn",
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
    seller_name: "rita",
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
    seller_name: "sam",
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
    seller_name: "tina",
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
export async function register(
  email: string,
  password: string,
  passwordConfirmation: string,
  communityId: number,
  _username: string,
): Promise<{ user: User; token: string }> {
  await sleep(300);

  if (!email.endsWith("@cuhk.edu.hk")) {
    throw new Error("Email must be a CUHK email (@cuhk.edu.hk)");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (password !== passwordConfirmation) {
    throw new Error("Password confirmation doesn't match");
  }

  mockCurrentUser = {
    id: Math.floor(Math.random() * 9000) + 1000,
    email,
    community_id: communityId,
  };

  return {
    user: mockCurrentUser,
    token: `mock_token_${Date.now()}`,
  };
}

// Map email prefixes to community ids for mock login
const mockUserCommunityMap: Record<string, number> = {
  "seller.shaw": 4,
  "buyer.shaw": 4,
  "seller.newasia": 2,
  "buyer.united": 3,
  "chung-chi-college": 1,
  "new-asia-college": 2,
  "united-college": 3,
  "shaw-college": 4,
  "morningside-college": 5,
  "sh-ho-college": 6,
  "cw-chu-college": 7,
  "wu-yee-sun-college": 8,
  "lee-woo-sing-college": 9,
};

export async function login(email: string, _password: string): Promise<{ user: User; token: string }> {
  await sleep(300);
  
  // Mock: accept any CUHK email
  if (!email.endsWith("@cuhk.edu.hk")) {
    throw new Error("Invalid email or password");
  }

  const prefix = email.split("@")[0];
  const community_id = mockUserCommunityMap[prefix] ?? 1;
  // Admin emails are the college-slug ones (e.g. shaw-college@cuhk.edu.hk)
  const role = prefix in mockUserCommunityMap && prefix.includes("-college") ? "admin" : "user";

  mockCurrentUser = {
    id: 999,
    email,
    community_id,
    role,
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

export async function createListing(
  title: string,
  description: string,
  price: number,
): Promise<Item> {
  await sleep(300);
  if (!mockCurrentUser) throw new Error("You must be logged in to post a listing.");
  const now = new Date().toISOString();
  const newItem: Item = {
    id: Math.max(...items.map((i) => i.id)) + 1,
    community_id: mockCurrentUser.community_id,
    user_id: mockCurrentUser.id,
    seller_name: mockCurrentUser.email.split("@")[0],
    title,
    description: description || null,
    price,
    status: "available",
    created_at: now,
    updated_at: now,
  };
  items.push(newItem);
  return newItem;
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

export async function updateItem(
  itemId: number,
  title: string,
  description: string,
  price: number,
): Promise<Item> {
  await sleep(300);
  const it = items.find((x) => x.id === itemId);
  if (!it) throw new Error("Item not found");
  it.title = title;
  it.description = description || null;
  it.price = price;
  it.updated_at = new Date().toISOString();
  return it;
}

export async function deleteItem(itemId: number): Promise<void> {
  await sleep(250);
  const idx = items.findIndex((x) => x.id === itemId);
  if (idx === -1) throw new Error("Item not found");
  items.splice(idx, 1);
}

// ===== Admin =====
let mockTransactions = [
  { id: 1, item_name: "Calculus Textbook", amount_hkd: 180, provider_ref: "mock_abc123", status: "succeeded", created_at: "2026-03-20 10:15" },
  { id: 2, item_name: "Wireless Mouse", amount_hkd: 32, provider_ref: "mock_def456", status: "succeeded", created_at: "2026-03-20 14:22" },
  { id: 3, item_name: "Laptop Stand", amount_hkd: 51, provider_ref: "mock_ghi789", status: "succeeded", created_at: "2026-03-21 09:05" },
  { id: 4, item_name: "USB-C Hub", amount_hkd: 42, provider_ref: "mock_jkl012", status: "succeeded", created_at: "2026-03-21 11:30" },
  { id: 5, item_name: "Physics Workbook", amount_hkd: 90, provider_ref: "mock_mno345", status: "succeeded", created_at: "2026-03-22 08:45" },
];

export async function getAnalytics() {
  await sleep(300);
  const grouped: Record<string, typeof mockTransactions> = {};
  for (const tx of mockTransactions) {
    const date = tx.created_at.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(tx);
  }
  const dailyLabels = Object.keys(grouped).sort();
  return {
    total_transactions: mockTransactions.length,
    total_gmv_hkd: mockTransactions.reduce((s, t) => s + t.amount_hkd, 0),
    daily_labels: dailyLabels,
    daily_counts: dailyLabels.map((d) => grouped[d].length),
    daily_gmv_hkd: dailyLabels.map((d) => grouped[d].reduce((s, t) => s + t.amount_hkd, 0)),
    recent_transactions: [...mockTransactions].reverse().slice(0, 10),
  };
}

