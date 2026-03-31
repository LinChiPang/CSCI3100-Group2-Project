require "rails_helper"

RSpec.describe "Payments", type: :request do
  it "renders payments page" do
    get "/payments"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Mock Stripe Checkout")
  end

  it "accepts a valid mock checkout" do
    post "/payments/mock_checkout", params: { item_name: "Desk Lamp", amount: 120 }

    expect(response).to redirect_to("/payments")
  end

  it "rejects invalid amount" do
    post "/payments/mock_checkout", params: { item_name: "Desk Lamp", amount: 0 }

    expect(response).to redirect_to("/payments")
  end
end
