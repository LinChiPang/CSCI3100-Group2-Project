When("I visit the homepage") do
  visit "/"
end

Then("I should see {string}") do |text|
  expect(page).to have_content(text)
end

Then("I should see the frontend app shell") do
  expect(page).to have_css("#app")
end

Then("I should see a successful response") do
  expect(page.status_code).to eq(200)
end
