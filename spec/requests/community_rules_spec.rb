require 'rails_helper'

RSpec.describe "CommunityRules", type: :request do
  let(:community) { create(:community) }
  let(:community_rule) { community.community_rule }
  let(:admin) { create(:user, community: community, role: 'admin') }
  let(:user) { create(:user, community: community) }

  describe "GET /communities/:slug/community_rule" do
    it "returns the community rule for the given slug" do
      community = create(:community, slug: "shaw-college")
      rule = community.community_rule
      get "/communities/#{community.slug}/community_rule", as: :json
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(rule.id)
    end

    it "returns 404 when community not found" do
      get "/communities/non-existent/community_rule", as: :json
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PATCH /communities/:community_id/community_rule" do
    context "as admin of the community" do
      it "updates the community rule" do
        patch "/communities/#{community.slug}/community_rule",
          params: { community_rule: { max_price: 500 } },
          headers: { "Authorization" => "Bearer #{token_for(admin)}" }, as: :json
        expect(response).to have_http_status(:ok)
        expect(community_rule.reload.max_price).to eq(500)
      end
    end

    context "as non-admin of the community" do
      it "returns forbidden" do
        patch "/communities/#{community.slug}/community_rule",
          params: { community_rule: { max_price: 500 } },
          headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "as admin of another community" do
      let(:other_community) { create(:community) }
      let(:other_admin) { create(:user, community: other_community, role: 'admin') }
      it "returns forbidden" do
        patch "/communities/#{community.slug}/community_rule",
          params: { community_rule: { max_price: 500 } },
          headers: { "Authorization" => "Bearer #{token_for(other_admin)}" }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
