require "rails_helper"

RSpec.describe "Search", type: :request do
  it "renders search page" do
    get "/search"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Fuzzy Search Suggestions")
  end

  it "returns fuzzy suggestions for a query" do
    get "/search/suggestions", params: { q: "lmp" }

    expect(response).to have_http_status(:ok)
    parsed = JSON.parse(response.body)
    expect(parsed["suggestions"]).to be_an(Array)
    expect(parsed["suggestions"]).not_to be_empty
  end

  it "returns empty suggestions for blank query" do
    get "/search/suggestions", params: { q: "   " }

    parsed = JSON.parse(response.body)
    expect(parsed["suggestions"]).to eq([])
  end
end
