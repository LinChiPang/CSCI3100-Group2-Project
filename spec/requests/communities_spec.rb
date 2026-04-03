require 'rails_helper'

RSpec.describe "Communities", type: :request do
  describe "GET /communities" do
    it "returns a list of communities (id, name, slug)" do
      create(:community, name: "Shaw College", slug: "shaw")
      create(:community, name: "New Asia", slug: "new-asia")
      get "/communities"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(2)
      expect(json.first.keys).to contain_exactly("id", "name", "slug")
    end
  end
end
