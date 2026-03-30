require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  let(:user) { create(:user, password: "password123", confirmed_at: Time.now) }

  def token_for(user)
    payload = { sub: user.id, jti: user.jti, exp: 1.day.from_now.to_i }
    secret = ENV['JWT_SECRET'] || 'test_secret_key_for_jwt'
    JWT.encode(payload, secret, 'HS256')
  end

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
  end

  describe "DELETE /users/logout" do
    it "logs out successfully" do
      delete "/users/logout", headers: { "Authorization" => "Bearer #{token_for(user)}" }, as: :json
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['message']).to eq("Logged out successfully")
    end
  end
end
