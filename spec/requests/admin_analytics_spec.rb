require "rails_helper"

RSpec.describe "Admin analytics", type: :request do
  let(:community) { create(:community) }
  let(:admin) { create(:user, role: "admin", community: community) }
  let(:other_community) { create(:community) }
  let(:other_admin) { create(:user, role: "admin", community: other_community) }

  def token_for(user)
    payload = { sub: user.id, jti: user.jti, exp: 1.day.from_now.to_i }
    JWT.encode(payload, ENV['JWT_SECRET'] || 'test_secret_key_for_jwt', 'HS256')
  end

  let(:auth_headers) { { "Authorization" => "Bearer #{token_for(admin)}" } }

  # Helper to create a transaction linked to a specific community
  def create_transaction(community:, item_name: "Test Item", amount_cents: 10_000)
    Transaction.create!(
      item_name: item_name,
      amount_cents: amount_cents,
      currency: "HKD",
      status: "succeeded",
      provider: "stripe_mock",
      provider_ref: SecureRandom.hex(8),
      community: community
    )
  end

  describe "GET /admin/analytics" do
    context "when requesting HTML (browser)" do
      it "serves the SPA shell (or returns a fallback response)" do
        get "/admin/analytics"
        expect(response).to have_http_status(:ok)
        expect(response.media_type).to eq("text/html")
        # We don't check exact content because the SPA shell depends on frontend build
      end
    end

    context "when requesting JSON with valid admin token" do
      it "returns analytics JSON scoped to the admin's community" do
        # Create transactions for the admin's community
        create_transaction(community: community, item_name: "Desk Lamp", amount_cents: 12_000)
        create_transaction(community: community, item_name: "Chair", amount_cents: 8_000)
        # Create a transaction for another community – should NOT be counted
        create_transaction(community: other_community, item_name: "Alien Item", amount_cents: 99_000)

        get "/admin/analytics", headers: auth_headers, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.media_type).to eq("application/json")
        json = JSON.parse(response.body)

        expect(json["total_transactions"]).to eq(2)
        expect(json["total_gmv_hkd"]).to eq(200.0) # (120 + 80)
        expect(json["daily_labels"]).to be_an(Array)
        expect(json["recent_transactions"]).to be_an(Array)
        expect(json["recent_transactions"].size).to eq(2)
      end

      it "aggregates transaction counts and GMV correctly" do
        create_transaction(community: community, amount_cents: 12_000)
        create_transaction(community: community, amount_cents: 8_000)

        get "/admin/analytics", headers: auth_headers, as: :json
        json = JSON.parse(response.body)

        expect(json["total_transactions"]).to eq(2)
        expect(json["total_gmv_hkd"]).to eq(200.0)
      end

      it "returns empty data when there are no transactions in the admin's community" do
        get "/admin/analytics", headers: auth_headers, as: :json
        json = JSON.parse(response.body)

        expect(json["total_transactions"]).to eq(0)
        expect(json["total_gmv_hkd"]).to eq(0.0)
        expect(json["daily_labels"]).to eq([])
        expect(json["recent_transactions"]).to eq([])
      end
    end

    context "when not authenticated" do
      it "returns unauthorized for JSON requests" do
        get "/admin/analytics", as: :json
        expect(response).to have_http_status(:unauthorized)
        expect(response.media_type).to eq("application/json")
      end
    end

    context "when authenticated as a non-admin user" do
      let(:regular_user) { create(:user, community: community) }
      let(:regular_token) { token_for(regular_user) }
      let(:regular_headers) { { "Authorization" => "Bearer #{regular_token}" } }

      it "returns forbidden" do
        get "/admin/analytics", headers: regular_headers, as: :json
        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)["error"]).to eq("Not authorized")
      end
    end

    context "when admin belongs to a different community" do
      let(:other_admin_headers) { { "Authorization" => "Bearer #{token_for(other_admin)}" } }

      it "only sees transactions from its own community, not others" do
        create_transaction(community: community, amount_cents: 1000)
        create_transaction(community: other_community, amount_cents: 2000)

        get "/admin/analytics", headers: other_admin_headers, as: :json
        json = JSON.parse(response.body)

        expect(json["total_transactions"]).to eq(1)
        expect(json["total_gmv_hkd"]).to eq(20.0) # 2000 cents = 20 HKD
      end
    end
  end
end
