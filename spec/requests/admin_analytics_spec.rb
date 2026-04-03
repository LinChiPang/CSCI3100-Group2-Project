require "rails_helper"

RSpec.describe "Admin analytics", type: :request do
  let(:admin) { create(:user, role: "admin") }
  let(:token) do
    secret = ENV["JWT_SECRET"] || "your_secret_key_here"
    payload = { sub: admin.id, jti: admin.jti, exp: 1.day.from_now.to_i }
    JWT.encode(payload, secret, "HS256")
  end
  let(:auth_headers) { { "Authorization" => "Bearer #{token}" } }

  it "renders analytics dashboard" do
    get "/admin/analytics", headers: auth_headers

    expect(response).to have_http_status(:ok)
    json = JSON.parse(response.body)
    expect(json).to include("total_transactions", "total_gmv_hkd", "daily_labels", "recent_transactions")
  end

  it "aggregates transaction counts and GMV" do
    Transaction.create!(item_name: "Desk Lamp", amount_cents: 12_000, provider_ref: "tx_a")
    Transaction.create!(item_name: "Chair", amount_cents: 8_000, provider_ref: "tx_b")

    get "/admin/analytics", headers: auth_headers

    json = JSON.parse(response.body)
    expect(json["total_transactions"]).to eq(2)
    expect(json["total_gmv_hkd"]).to eq(200.0)
  end
end
