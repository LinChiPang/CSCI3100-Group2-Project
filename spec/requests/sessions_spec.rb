require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  let(:user) { create(:user, password: "password123", confirmed_at: Time.now) }

  describe "POST /users/login" do
    context "with valid credentials" do
      it "returns a token" do
        post "/users/login", params: { user: { email: user.email, password: "password123" } }, as: :json
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq(user.email)
      end
    end

    context "with invalid password" do
      it "returns unauthorized" do
        post "/users/login", params: { user: { email: user.email, password: "wrong" } }, as: :json
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['error']).to eq("Invalid email or password")
      end
    end

    context "with unconfirmed user" do
      let(:unconfirmed) { create(:user, confirmed_at: nil) }
      it "returns unauthorized" do
        post "/users/login", params: { user: { email: unconfirmed.email, password: "password123" } }, as: :json
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['error']).to eq("You have to confirm your email address before continuing.")
      end
    end

    context "with non-existent email" do
      it "returns unauthorized" do
        post "/users/login", params: { user: { email: "nonexistent@cuhk.edu.hk", password: "password123" } }, as: :json
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['error']).to eq("Invalid email or password")
      end
    end

    context "with a stale authorization header" do
      it "still returns a token for valid credentials" do
        post "/users/login.json",
          params: { user: { email: user.email, password: "password123" } },
          headers: { "Authorization" => "Bearer invalid.token.here" },
          as: :json

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["token"]).to be_present
      end
    end
  end

  describe "DELETE /users/logout" do
    it "logs out successfully" do
      post "/users/login", params: { user: { email: user.email, password: "password123" } }, as: :json
      token = JSON.parse(response.body)["token"]

      delete "/users/logout", headers: { "Authorization" => "Bearer #{token}" }, as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['message']).to eq("Logged out successfully")
    end

    it "rejects the same token after JSON logout" do
      post "/users/login", params: { user: { email: user.email, password: "password123" } }, as: :json
      token = JSON.parse(response.body)["token"]
      auth_headers = { "Authorization" => "Bearer #{token}" }

      get "/items", headers: auth_headers, as: :json
      expect(response).to have_http_status(:ok)

      delete "/users/logout.json", headers: auth_headers, as: :json
      expect(response).to have_http_status(:ok)

      get "/items", headers: auth_headers, as: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
