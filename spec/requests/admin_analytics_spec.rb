require "rails_helper"

RSpec.describe "Admin analytics", type: :request do
  it "renders analytics dashboard" do
    get "/admin/analytics"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Admin Analytics Dashboard")
    expect(response.body).to include("Total transactions")
  end

  it "aggregates transaction counts and GMV" do
    Transaction.create!(item_name: "Desk Lamp", amount_cents: 12_000, provider_ref: "tx_a")
    Transaction.create!(item_name: "Chair", amount_cents: 8_000, provider_ref: "tx_b")

    get "/admin/analytics"

    expect(response.body).to include("Total transactions:</strong> 2")
    expect(response.body).to include("Total GMV:</strong> HK$200")
  end
end
