puts "Seeding communities..."

communities = [
  { name: "Shaw College", slug: "shaw-college" },
  { name: "New Asia College", slug: "new-asia-college" },
  { name: "United College", slug: "united-college" }
].map do |attrs|
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
  }
}

communities.each do |community|
  rule = community.community_rule || community.build_community_rule
  defaults = community_rule_defaults.fetch(community.slug)
  rule.assign_attributes(defaults)
  rule.save!
end

puts "Seeding users..."

users = [
  { email: "seller.shaw@cuhk.edu.hk", community_slug: "shaw-college" },
  { email: "buyer.shaw@cuhk.edu.hk", community_slug: "shaw-college" },
  { email: "seller.newasia@cuhk.edu.hk", community_slug: "new-asia-college" },
  { email: "buyer.united@cuhk.edu.hk", community_slug: "united-college" }
].map do |attrs|
  community = Community.find_by!(slug: attrs[:community_slug])
  user = User.find_or_initialize_by(email: attrs[:email])
  user.password = "Password123!"
  user.password_confirmation = "Password123!"
  user.community = community
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
