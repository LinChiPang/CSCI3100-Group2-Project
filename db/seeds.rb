puts "Seeding communities..."

# List of all 9 colleges with slugs
colleges = [
  { name: "Shaw College", slug: "shaw-college" },
  { name: "New Asia College", slug: "new-asia-college" },
  { name: "United College", slug: "united-college" },
  { name: "Chung Chi College", slug: "chung-chi-college" },
  { name: "Wu Yee Sun College", slug: "wu-yee-sun-college" },
  { name: "Lee Woo Sing College", slug: "lee-woo-sing-college" },
  { name: "Morningside College", slug: "morningside-college" },
  { name: "S.H. Ho College", slug: "sh-ho-college" },
  { name: "C.W. Chu College", slug: "cw-chu-college" }
]

communities = colleges.map do |attrs|
  Community.find_or_create_by!(slug: attrs[:slug]) do |community|
    community.name = attrs[:name]
  end
end

puts "Seeding community rules..."

community_rule_defaults = {
  "shaw-college" => {
    posting_enabled: true,
    max_active_listings: 8,
    max_price: 5_000,
    allowed_categories: %w[books electronics furniture]
  },
  "new-asia-college" => {
    posting_enabled: true,
    max_active_listings: 6,
    max_price: 4_000,
    allowed_categories: %w[books kitchen sports]
  },
  "united-college" => {
    posting_enabled: true,
    max_active_listings: 10,
    max_price: 8_000,
    allowed_categories: %w[books electronics furniture lifestyle]
  },
  "default" => {
    posting_enabled: true,
    max_active_listings: 5,
    max_price: 3_000,
    allowed_categories: %w[books electronics]
  }
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
  { email: "seller.shaw@cuhk.edu.hk", community_slug: "shaw-college", username: "Shaw Seller" },
  { email: "buyer.shaw@cuhk.edu.hk", community_slug: "shaw-college", username: "Shaw Buyer" },
  { email: "seller.newasia@cuhk.edu.hk", community_slug: "new-asia-college", username: "New Asia Seller" },
  { email: "buyer.united@cuhk.edu.hk", community_slug: "united-college", username: "United Buyer" }
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
  { title: "Algorithms Textbook", description: "CS fundamentals", price: 280, user: seller_shaw, community: seller_shaw.community, status: :available },
  { title: "IKEA Desk Lamp", description: "Working condition", price: 120, user: seller_shaw, community: seller_shaw.community, status: :reserved },
  { title: "Office Chair", description: "Mesh back, used 1 year", price: 450, user: seller_shaw, community: seller_shaw.community, status: :sold },
  { title: "Rice Cooker", description: "1.8L, like new", price: 300, user: seller_new_asia, community: seller_new_asia.community, status: :available },
  { title: "Bluetooth Speaker", description: "Portable", price: 220, user: seller_new_asia, community: seller_new_asia.community, status: :available },
  { title: "Calculus Notes", description: "MATH1010 complete notes", price: 80, user: buyer_united, community: buyer_united.community, status: :available }
]

items_data.each do |attrs|
  item = Item.find_or_initialize_by(title: attrs[:title], user: attrs[:user], community: attrs[:community])
  item.description = attrs[:description]
  item.price = attrs[:price]
  item.status = attrs[:status]
  item.save!
end

puts "Seeding transactions..."

[
  { item_name: "IKEA Desk Lamp", amount_cents: 12_000, provider_ref: "seed_tx_001" },
  { item_name: "Office Chair", amount_cents: 45_000, provider_ref: "seed_tx_002" },
  { item_name: "Rice Cooker", amount_cents: 30_000, provider_ref: "seed_tx_003" }
].each do |tx|
  Transaction.find_or_create_by!(provider_ref: tx[:provider_ref]) do |transaction|
    transaction.item_name = tx[:item_name]
    transaction.amount_cents = tx[:amount_cents]
    transaction.currency = "HKD"
    transaction.status = "succeeded"
    transaction.provider = "stripe_mock"
  end
end

puts "Seed complete."
