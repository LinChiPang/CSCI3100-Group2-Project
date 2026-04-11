require "rails_helper"

RSpec.describe "Payments", type: :request do
  let(:user) { create(:user, confirmed_at: Time.now) }
  let(:token) do
    payload = { sub: user.id, jti: user.jti, exp: 1.day.from_now.to_i }
    JWT.encode(payload, ENV['JWT_SECRET'] || 'test_secret_key_for_jwt', 'HS256')
  end

  it "renders payments page" do
    get "/payments"
    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Mock Stripe Checkout")
  end

  it "accepts a valid mock checkout and records transaction" do
    expect do
      post "/payments/mock_checkout",
           params: { item_name: "Desk Lamp", amount: 120 },
           headers: { "Authorization" => "Bearer #{token}" }
    end.to change(Transaction, :count).by(1)

    expect(response).to redirect_to("/payments")
    expect(Transaction.last.amount_cents).to eq(12_000)
  end

  it "rejects invalid amount and does not record transaction" do
    expect do
      post "/payments/mock_checkout",
           params: { item_name: "Desk Lamp", amount: 0 },
           headers: { "Authorization" => "Bearer #{token}" }
    end.not_to change(Transaction, :count)

    expect(response).to redirect_to("/payments")
  end
end
