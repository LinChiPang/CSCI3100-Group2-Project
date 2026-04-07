require "rails_helper"

RSpec.describe "Admin analytics", type: :request do
  let(:admin) { create(:user, role: "admin") }
  let(:token) do
    secret = ENV["JWT_SECRET"] || "your_secret_key_here"
    payload = { sub: admin.id, jti: admin.jti, exp: 1.day.from_now.to_i }
    JWT.encode(payload, secret, "HS256")
  end
  let(:auth_headers) { { "Authorization" => "Bearer #{token}" } }

  it "serves the SPA shell for HTML requests" do
    get "/admin/analytics"

    expect(response).to have_http_status(:ok)
    expect(response.media_type).to eq("text/html")
    expect(response.body).to include('<div id="app"></div>')
  end

  it "returns analytics JSON for authenticated JSON requests" do
    get "/admin/analytics", headers: auth_headers, as: :json

    expect(response).to have_http_status(:ok)
    expect(response.media_type).to eq("application/json")
    json = JSON.parse(response.body)
    expect(json).to include("total_transactions", "total_gmv_hkd", "daily_labels", "recent_transactions")
  end

  it "aggregates transaction counts and GMV" do
    Transaction.create!(item_name: "Desk Lamp", amount_cents: 12_000, provider_ref: "tx_a")
    Transaction.create!(item_name: "Chair", amount_cents: 8_000, provider_ref: "tx_b")

    get "/admin/analytics", headers: auth_headers, as: :json

    json = JSON.parse(response.body)
    expect(json["total_transactions"]).to eq(2)
    expect(json["total_gmv_hkd"]).to eq(200.0)
  end

  it "keeps explicit JSON-format requests on the backend path" do
    get "/admin/analytics.json"

    expect(response).to have_http_status(:unauthorized)
    expect(response.media_type).to eq("application/json")
    expect(response.body).not_to include('<div id="app"></div>')
  end
end
