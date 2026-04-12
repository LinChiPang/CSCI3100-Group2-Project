puts "Seeding communities..."

# List of all 9 CUHK colleges with slugs
colleges = [
  { name: "Chung Chi College",    slug: "chung-chi-college" },
  { name: "New Asia College",     slug: "new-asia-college" },
  { name: "United College",       slug: "united-college" },
  { name: "Shaw College",         slug: "shaw-college" },
  { name: "Morningside College",  slug: "morningside-college" },
  { name: "S.H. Ho College",      slug: "sh-ho-college" },
  { name: "CW Chu College",       slug: "cw-chu-college" },
  { name: "Wu Yee Sun College",   slug: "wu-yee-sun-college" },
  { name: "Lee Woo Sing College", slug: "lee-woo-sing-college" }
]

communities = colleges.map do |attrs|
  Community.find_or_create_by!(slug: attrs[:slug]) do |community|
    community.name = attrs[:name]
  end
end

puts "Seeding community rules..."

community_rule_defaults = {
  "chung-chi-college"    => { posting_enabled: true, max_active_listings: 8,  max_price: 5_000, allowed_categories: %w[books electronics furniture] },
  "new-asia-college"     => { posting_enabled: true, max_active_listings: 6,  max_price: 4_000, allowed_categories: %w[books kitchen sports] },
  "united-college"       => { posting_enabled: true, max_active_listings: 10, max_price: 8_000, allowed_categories: %w[books electronics furniture lifestyle] },
  "shaw-college"         => { posting_enabled: true, max_active_listings: 8,  max_price: 5_000, allowed_categories: %w[books electronics furniture] },
  "morningside-college"  => { posting_enabled: true, max_active_listings: 5,  max_price: 6_000, allowed_categories: %w[books electronics lifestyle] },
  "sh-ho-college"        => { posting_enabled: true, max_active_listings: 6,  max_price: 4_500, allowed_categories: %w[books furniture kitchen] },
  "cw-chu-college"       => { posting_enabled: true, max_active_listings: 6,  max_price: 4_000, allowed_categories: %w[books electronics sports] },
  "wu-yee-sun-college"   => { posting_enabled: true, max_active_listings: 7,  max_price: 5_000, allowed_categories: %w[books furniture lifestyle] },
  "lee-woo-sing-college" => { posting_enabled: true, max_active_listings: 7,  max_price: 5_500, allowed_categories: %w[books electronics furniture] }
}

communities.each do |community|
  defaults = community_rule_defaults[community.slug] || community_rule_defaults["default"]
  # Find or create the community rule for this community
  rule = CommunityRule.find_or_initialize_by(community: community)
  rule.update!(defaults)
end

puts "Seeding admin users for each college..."

admin_password = "password123" # you can change this

colleges.each do |college|
  admin_email = "#{college[:slug]}@cuhk.edu.hk"
  admin_username = "#{college[:name]} Admin"
  community = Community.find_by!(slug: college[:slug])
  User.find_or_create_by!(email: admin_email) do |user|
    user.username = admin_username
    user.password = admin_password
    user.password_confirmation = admin_password
    user.community = community
    user.role = "admin"
    user.confirmed_at = Time.current
  end
end

puts "Seeding users..."

users = [
  { email: "seller.shaw@cuhk.edu.hk",       community_slug: "shaw-college",       username: "Shaw Seller" },
  { email: "buyer.shaw@cuhk.edu.hk",        community_slug: "shaw-college",       username: "Shaw Buyer" },
  { email: "seller.newasia@cuhk.edu.hk",    community_slug: "new-asia-college",   username: "New Asia Seller" },
  { email: "buyer.united@cuhk.edu.hk",      community_slug: "united-college",     username: "United Buyer" }
].map do |attrs|
  community = Community.find_by!(slug: attrs[:community_slug])
  user = User.find_or_initialize_by(email: attrs[:email])
  user.password = "Password123!"
  user.password_confirmation = "Password123!"
  user.community = community
  user.username = attrs[:username]
  user.confirmed_at ||= Time.current
  user.save!
  user
end

seller_shaw, buyer_shaw, seller_new_asia, buyer_united = users

puts "Seeding items..."

items_data = [
  { title: "Algorithms Textbook", description: "CS fundamentals", price: 280, user: seller_shaw, community: seller_shaw.community, status: :available, category: "books" },
  { title: "IKEA Desk Lamp", description: "Working condition", price: 120, user: seller_shaw, community: seller_shaw.community, status: :reserved, category: "electronics" },
  { title: "Office Chair", description: "Mesh back, used 1 year", price: 450, user: seller_shaw, community: seller_shaw.community, status: :sold, category: "furniture" },
  { title: "Rice Cooker", description: "1.8L, like new", price: 300, user: seller_new_asia, community: seller_new_asia.community, status: :available, category: "kitchen" },
  { title: "Basketball", description: "Nice", price: 220, user: seller_new_asia, community: seller_new_asia.community, status: :available, category: "sports" },
  { title: "Calculus Notes", description: "MATH1010 complete notes", price: 80, user: buyer_united, community: buyer_united.community, status: :available, category: "books" }
]

items_data.each do |attrs|
  item = Item.find_or_initialize_by(title: attrs[:title], user: attrs[:user], community: attrs[:community])
  item.description = attrs[:description]
  item.price = attrs[:price]
  item.status = attrs[:status]
  item.category = attrs[:category]
  item.save!
end

puts "Seeding transactions..."

all_communities = Community.all.to_a

transactions_data = [
  # Mar 20 — 2 transactions
  { item_name: "Calculus Textbook (Vol. 1)",     amount_cents: 18_000, provider_ref: "seed_tx_001", date: "2026-03-20 10:15:00" },
  { item_name: "IKEA Desk Lamp",                 amount_cents: 12_000, provider_ref: "seed_tx_002", date: "2026-03-20 14:30:00" },
  # Mar 21 — 3 transactions
  { item_name: "Wireless Mouse (USB-C)",         amount_cents:  3_200, provider_ref: "seed_tx_003", date: "2026-03-21 09:05:00" },
  { item_name: "USB-C Hub (7-in-1)",             amount_cents:  4_200, provider_ref: "seed_tx_004", date: "2026-03-21 11:20:00" },
  { item_name: "Physics Workbook",               amount_cents:  9_000, provider_ref: "seed_tx_005", date: "2026-03-21 16:45:00" },
  # Mar 23 — 4 transactions
  { item_name: "Office Chair (Breathable)",      amount_cents: 45_000, provider_ref: "seed_tx_006", date: "2026-03-23 08:00:00" },
  { item_name: "Rice Cooker",                    amount_cents: 30_000, provider_ref: "seed_tx_007", date: "2026-03-23 10:10:00" },
  { item_name: "Mechanical Keyboard",            amount_cents:  5_900, provider_ref: "seed_tx_008", date: "2026-03-23 13:55:00" },
  { item_name: "Laptop Stand (Aluminum)",        amount_cents:  5_100, provider_ref: "seed_tx_009", date: "2026-03-23 17:30:00" },
  # Mar 25 — 2 transactions
  { item_name: "Chemistry Lab Manual",           amount_cents: 16_000, provider_ref: "seed_tx_010", date: "2026-03-25 09:40:00" },
  { item_name: "Power Bank 10000mAh",            amount_cents:  6_800, provider_ref: "seed_tx_011", date: "2026-03-25 14:15:00" },
  # Mar 27 — 5 transactions
  { item_name: "Linear Algebra Notes",           amount_cents:  6_500, provider_ref: "seed_tx_012", date: "2026-03-27 08:30:00" },
  { item_name: "Standing Desk Converter",        amount_cents:  9_800, provider_ref: "seed_tx_013", date: "2026-03-27 10:00:00" },
  { item_name: "Bluetooth Speaker",             amount_cents: 22_000, provider_ref: "seed_tx_014", date: "2026-03-27 12:20:00" },
  { item_name: "Discrete Mathematics Text",      amount_cents: 19_900, provider_ref: "seed_tx_015", date: "2026-03-27 15:00:00" },
  { item_name: "USB Flash Drive 64GB",           amount_cents:  2_400, provider_ref: "seed_tx_016", date: "2026-03-27 17:45:00" },
  # Mar 29 — 3 transactions
  { item_name: "Study Table (Small)",            amount_cents:  4_300, provider_ref: "seed_tx_017", date: "2026-03-29 09:00:00" },
  { item_name: "2-Drawer Storage Cabinet",       amount_cents: 12_000, provider_ref: "seed_tx_018", date: "2026-03-29 11:30:00" },
  { item_name: "Introduction to Algorithms",     amount_cents: 28_000, provider_ref: "seed_tx_019", date: "2026-03-29 14:00:00" },
  # Apr 1 — 4 transactions
  { item_name: "Study Chair (Ergonomic)",        amount_cents:  6_400, provider_ref: "seed_tx_020", date: "2026-04-01 08:50:00" },
  { item_name: "Math Formula Sheet",             amount_cents:  5_000, provider_ref: "seed_tx_021", date: "2026-04-01 10:30:00" },
  { item_name: "Wooden Desk Lamp",               amount_cents:  7_500, provider_ref: "seed_tx_022", date: "2026-04-01 13:15:00" },
  { item_name: "Mechanical Keyboard (Brown)",    amount_cents:  5_900, provider_ref: "seed_tx_023", date: "2026-04-01 16:40:00" },
  # Apr 2 — 2 transactions
  { item_name: "Ergonomic Mouse Pad",            amount_cents:  2_800, provider_ref: "seed_tx_024", date: "2026-04-02 09:20:00" },
  { item_name: "Monitor Light Bar",              amount_cents:  8_800, provider_ref: "seed_tx_025", date: "2026-04-02 15:00:00" },
  # Apr 3 — 3 transactions
  { item_name: "HDMI Cable 2m",                  amount_cents:  1_800, provider_ref: "seed_tx_026", date: "2026-04-03 08:10:00" },
  { item_name: "Portable SSD 512GB",             amount_cents: 38_000, provider_ref: "seed_tx_027", date: "2026-04-03 10:45:00" },
  { item_name: "Noise-Cancelling Earbuds",       amount_cents: 55_000, provider_ref: "seed_tx_028", date: "2026-04-03 14:30:00" }
]

transactions_data.each_with_index do |tx, idx|
  community = all_communities[idx % all_communities.size]
  record = Transaction.find_or_create_by!(provider_ref: tx[:provider_ref]) do |t|
    t.item_name    = tx[:item_name]
    t.amount_cents = tx[:amount_cents]
    t.currency     = "HKD"
    t.status       = "succeeded"
    t.provider     = "stripe_mock"
    t.community    = community
  end
  # Backdate created_at so the daily grouping is meaningful
  record.update_columns(created_at: tx[:date], updated_at: tx[:date])
end

puts "Seed complete."
