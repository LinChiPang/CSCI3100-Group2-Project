require "rails_helper"

RSpec.describe "Search", type: :request do
  it "renders search page" do
    get "/search"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Fuzzy Search Suggestions")
  end

  it "returns fuzzy suggestions for a query" do
    Transaction.create!(item_name: "Desk Lamp", amount_cents: 12_000, provider_ref: "tx_search_a")
    get "/search/suggestions", params: { q: "lmp" }

    expect(response).to have_http_status(:ok)
    parsed = JSON.parse(response.body)
    expect(parsed["suggestions"]).to be_an(Array)
    expect(parsed["suggestions"]).to include("Desk Lamp")
  end

  it "returns empty suggestions for blank query" do
    get "/search/suggestions", params: { q: "   " }

    parsed = JSON.parse(response.body)
    expect(parsed["suggestions"]).to eq([])
  end
end
