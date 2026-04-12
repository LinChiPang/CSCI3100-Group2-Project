# spec/requests/items_spec.rb
require 'rails_helper'

RSpec.describe "Items", type: :request do
  let(:user) { create(:user) }                      # automatically has community
  let(:community) { user.community }
  let(:other_community) { create(:community) }
  let(:item) { create(:item, user: user, community: community) }

  describe "GET /items" do
    it "returns a list of items (only from user's community)" do
      create(:item, community: community)   # should appear
      create(:item, community: other_community)   # should not appear
      get "/items", headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:ok)
      items = JSON.parse(response.body)
      expect(items.size).to eq(1)
      expect(items.first['community']['id']).to eq(community.id)
    end

    it "filters by status" do
      create(:item, community: community, status: 'reserved')
      get "/items", params: { status: 'available' }, headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      items = JSON.parse(response.body)
      expect(items.all? { |i| i['status'] == 'available' }).to be true
    end

    it "filters by repeated statuses and categories" do
      book = create(:item, community: community, title: "Available Book", status: 'available', category: 'books')
      electronics = create(:item, community: community, title: "Reserved Electronics", status: 'reserved', category: 'electronics')
      create(:item, community: community, title: "Sold Book", status: 'sold', category: 'books')
      create(:item, community: community, title: "Reserved Furniture", status: 'reserved', category: 'furniture')

      get "/items?status=available&status=reserved&category=books&category=electronics",
        headers: { "Authorization" => "Bearer #{token_for(user)}" },
        as: :json

      items = JSON.parse(response.body)
      expect(items.map { |i| i['id'] }).to contain_exactly(book.id, electronics.id)
    end

    it "filters by price range" do
      create(:item, community: community, price: 50)
      create(:item, community: community, price: 200)
      get "/items", params: { min_price: 100, max_price: 180 }, headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      items = JSON.parse(response.body)
      expect(items.map { |i| i['price'].to_f }).to all(be_between(100, 180))
    end

    it "searches by keyword" do
      create(:item, community: community, title: 'Programming Book')
      create(:item, community: community, description: 'A great textbook for book lovers')
      get "/items", params: { q: 'book' }, headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      items = JSON.parse(response.body)
      expect(items.size).to eq(2)
    end

    it "returns empty array when no items in user's community" do
      # Ensure user has no items in its community
      user.items.destroy_all
      get "/items", headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to be_empty
    end
  end

  describe "GET /items/:id" do
    it "returns the item" do
      get "/items/#{item.id}", headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(item.id)
    end

    it "returns 404 when trying to access an item from another community" do
      other_community = create(:community)
      other_user = create(:user, community: other_community)
      item_in_other_community = create(:item, community: other_community)
      get "/items/#{item_in_other_community.id}",
        headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:not_found)
    end

    it "returns 404 when item does not exist" do
      get "/items/999999", headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /items" do
    context "with valid token" do
      it "creates an item" do
        post "/items",
          params: { item: { title: "New Item", price: 50, category: "others" } },
          headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['title']).to eq("New Item")
        # Ensure community is set to user's community
        expect(JSON.parse(response.body)['community']['id']).to eq(community.id)
      end
    end

    context "without token" do
      it "returns unauthorized" do
        post "/items", params: { item: { title: "New Item", price: 50 } }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "with invalid token" do
      it "returns unauthorized" do
        get "/items", headers: { "Authorization" => "Bearer invalid.token.here" }, as: :json
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['error']).to eq("Invalid token")
      end
    end

    context "with invalid params" do
      it "returns unprocessable entity" do
        post "/items",
          params: { item: { title: "", price: -5 } },
          headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        errors = JSON.parse(response.body)['errors']
        expect(errors).to include("Title can't be blank")
        expect(errors).to include("Price must be greater than or equal to 0")
      end
    end
  end

  describe "PATCH /items/:id" do
    context "as owner" do
      it "updates the item" do
        patch "/items/#{item.id}",
          params: { item: { title: "Updated Title" } },
          headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['title']).to eq("Updated Title")
      end
    end

    context "as non-owner" do
      let(:other_user) { create(:user, community: community) }   # same community, different user
      it "returns forbidden" do
        patch "/items/#{item.id}",
          params: { item: { title: "Updated Title" } },
          headers: { "Authorization" => "Bearer #{token_for(other_user)}" }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "with invalid params" do
      it "returns unprocessable entity" do
        patch "/items/#{item.id}",
          params: { item: { price: -10 } },
          headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        errors = JSON.parse(response.body)['errors']
        expect(errors).to include("Price must be greater than or equal to 0")
      end
    end
  end

  describe "PATCH /items/:id/reserve" do
    let(:other_user) { create(:user) }
    it "reserves the item for another user" do
      # Ensure other_user is in same community
      other_user.update(community: community)
      patch "/items/#{item.id}/reserve",
        headers: { "Authorization" => "Bearer #{token_for(other_user)}" }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['status']).to eq("reserved")
    end

    it "cannot reserve when already reserved" do
      item.reserve!
      other_user.update(community: community)
      patch "/items/#{item.id}/reserve",
        headers: { "Authorization" => "Bearer #{token_for(other_user)}" }
      expect(response).to have_http_status(:forbidden)
    end

    it "cannot reserve when already sold" do
      other_user = create(:user, community: community)
      # Reserve the item (by other user)
      patch "/items/#{item.id}/reserve",
        headers: { "Authorization" => "Bearer #{token_for(other_user)}" }, as: :json
      expect(response).to have_http_status(:ok)
      # Sell the item (by owner)
      patch "/items/#{item.id}/sell",
        headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:ok)
      # Attempt to reserve again
      patch "/items/#{item.id}/reserve",
        headers: { "Authorization" => "Bearer #{token_for(other_user)}" }, as: :json
      expect(response).to have_http_status(:forbidden)
    end

    it "cannot reserve when user is the owner" do
      patch "/items/#{item.id}/reserve",
        headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "PATCH /items/:id/sell" do
    it "sells the item after reservation" do
      item.reserve!
      patch "/items/#{item.id}/sell",
        headers: { "Authorization" => "Bearer #{token_for(user)}" }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['status']).to eq("sold")
    end

    it "cannot sell before reservation" do
      patch "/items/#{item.id}/sell",
        headers: { "Authorization" => "Bearer #{token_for(user)}" }
      expect(response).to have_http_status(:forbidden)
    end

    it "cannot sell when not reserved" do
      patch "/items/#{item.id}/sell",
        headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "DELETE /items/:id" do
    it "deletes the item as owner" do
      delete "/items/#{item.id}",
        headers: { "Authorization" => "Bearer #{token_for(user)}" }
      expect(response).to have_http_status(:no_content)
    end

    it "cannot delete as non-owner" do
      other_user = create(:user, community: community)   # same community
      delete "/items/#{item.id}",
        headers: { "Authorization" => "Bearer #{token_for(other_user)}" }
      expect(response).to have_http_status(:forbidden)
    end

    context "as admin of the same community" do
      let(:admin) { create(:user, community: community, role: 'admin') }
      it "deletes the item" do
        delete "/items/#{item.id}", headers: { "Authorization" => "Bearer #{token_for(admin)}" }, as: :json
        expect(response).to have_http_status(:no_content)
      end
    end

    context "as admin of a different community" do
      let(:community1) { create(:community) }
      let(:community2) { create(:community) }
      let(:admin1) { create(:user, community: community1, role: 'admin') }
      let(:admin2) { create(:user, community: community2, role: 'admin') }
      let(:item_in_community1) { create(:item, community: community1, user: admin1) }

      it "cannot delete item from another community" do
        delete "/items/#{item_in_community1.id}",
               headers: { "Authorization" => "Bearer #{token_for(admin2)}" }, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
