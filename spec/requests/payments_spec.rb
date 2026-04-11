require "rails_helper"

RSpec.describe "Payments", type: :request do
  it "renders payments page" do
    get "/payments"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Mock Stripe Checkout")
  end

  it "accepts a valid mock checkout and records transaction" do
    expect do
      post "/payments/mock_checkout", params: { item_name: "Desk Lamp", amount: 120 }
    end.to change(Transaction, :count).by(1)

    expect(response).to redirect_to("/payments")
    expect(Transaction.last.amount_cents).to eq(12_000)
  end

  it "rejects invalid amount and does not record transaction" do
    expect do
      post "/payments/mock_checkout", params: { item_name: "Desk Lamp", amount: 0 }
    end.not_to change(Transaction, :count)

    expect(response).to redirect_to("/payments")
  end

  it "records community_id on JSON checkout when Bearer token is present" do
    buyer = create(:user, community: create(:community))
    token = token_for(buyer)

    expect do
      post "/payments/mock_checkout",
           params: { item_name: "Paid item", amount: 50 },
           headers: { "Authorization" => "Bearer #{token}" },
           as: :json
    end.to change(Transaction, :count).by(1)

    expect(response).to have_http_status(:created)
    expect(Transaction.last.community_id).to eq(buyer.community_id)
  end

  it "uses the listing community when item_id is in the same community as the buyer" do
    community = create(:community)
    buyer = create(:user, community: community)
    seller = create(:user, community: community)
    item = create(:item, user: seller, community: community, title: "Listed thing")
    token = token_for(buyer)

    post "/payments/mock_checkout",
         params: { item_name: item.title, amount: 10, item_id: item.id },
         headers: { "Authorization" => "Bearer #{token}" },
         as: :json

    expect(response).to have_http_status(:created)
    expect(Transaction.last.community_id).to eq(community.id)
  end
end
