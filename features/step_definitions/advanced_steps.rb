When("I visit the payments page") do
  visit "/payments"
end

When("I submit a mock payment for {string} with amount {int}") do |item_name, amount|
  fill_in "Item name", with: item_name
  fill_in "Amount (HKD)", with: amount
  click_button "Pay with Stripe (mock)"
end

When("I visit the search page") do
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
  visit "/admin/analytics"
end
