When("I visit the payments page") do
  visit "/payments"
end

When("I submit a mock payment for {string} with amount {int}") do |item_name, amount|
  fill_in "Item name", with: item_name
  fill_in "Amount (HKD)", with: amount
  click_button "Pay with Stripe (mock)"
end

When("I visit the search page") do
  Transaction.find_or_create_by!(provider_ref: "bdd_search_seed") do |tx|
    tx.item_name = "Desk Lamp"
    tx.amount_cents = 12000
    tx.currency = "hkd"
    tx.status = "succeeded"
    tx.provider = "stripe_mock"
  end
  visit "/search"
end

When("I type {string} into the search box") do |query|
  fill_in "Search", with: query
end

Then("I should see {string} in suggestions") do |text|
  expect(page).to have_css("#search-suggestions", text: text)
end

Given("there are {int} transactions") do |count|
  count.times do |i|
    Transaction.create!(item_name: "Item #{i + 1}", amount_cents: 1000, provider_ref: "bdd_tx_#{i}")
  end
end

When("I visit the analytics dashboard") do
  community = Community.first || Community.create!(name: "Admin Community", slug: "admin-community")
  admin = User.find_or_create_by!(email: "cucumber-admin@cuhk.edu.hk") do |u|
    u.password             = "password123"
    u.password_confirmation = "password123"
    u.username             = "cucumberadmin"
    u.role                 = "admin"
    u.confirmed_at         = Time.now
    u.community            = community
  end
  secret  = ENV["JWT_SECRET"] || "your_secret_key_here"
  payload = { sub: admin.id, jti: admin.jti, exp: 1.day.from_now.to_i }
  token   = JWT.encode(payload, secret, "HS256")
  page.driver.header "Authorization", "Bearer #{token}"
  visit "/admin/analytics"
end
