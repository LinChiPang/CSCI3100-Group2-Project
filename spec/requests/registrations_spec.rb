require 'rails_helper'

RSpec.describe "Registrations", type: :request do
  let(:community) { create(:community) }

  describe "POST /users" do
    context "with valid params" do
      it "creates a new user" do
        expect {
          post "/users", params: {
            user: {
              email: "test@cuhk.edu.hk",
              password: "password123",
              password_confirmation: "password123",
              username: "testuser",
              community_id: community.id
            }
          }, as: :json
        }.to change(User, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['message']).to eq("User created successfully. Please confirm your email.")
      end
    end

    context "with invalid email domain" do
      it "returns unprocessable entity" do
        post "/users", params: {
          user: {
            email: "test@gmail.com",
            password: "password123",
            password_confirmation: "password123",
            username: "testuser",
            community_id: community.id
          }
        }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        errors = JSON.parse(response.body)['errors']
        expect(errors).to include(/must be a CUHK email/)
      end
    end

    context "with missing password confirmation" do
      it "returns unprocessable entity" do
        post "/users", params: {
          user: {
            email: "test@cuhk.edu.hk",
            password: "password123",
            password_confirmation: "",
            username: "testuser",
            community_id: community.id
          }
        }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        errors = JSON.parse(response.body)['errors']
        expect(errors).to include(/Password confirmation doesn't match Password/)
      end
    end

    context "with missing community" do
      it "returns unprocessable entity" do
        post "/users", params: {
          user: {
            email: "test@cuhk.edu.hk",
            password: "password123",
            password_confirmation: "password123",
            username: "testuser"
            # no community_id
          }
        }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        errors = JSON.parse(response.body)['errors']
        expect(errors).to include(/Community must exist/)
      end
    end

    context "with missing username" do
      it "returns unprocessable entity" do
        post "/users", params: {
          user: {
            email: "test@cuhk.edu.hk",
            password: "password123",
            password_confirmation: "password123",
            community_id: community.id
            # no username
          }
        }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        errors = JSON.parse(response.body)['errors']
        expect(errors).to include(/Username can't be blank/)
      end
    end

    context "when already logged in" do
      let(:user) { create(:user, community: community) }
      it "returns forbidden" do
        # First, login to get a token
        post "/users/login", params: { user: { email: user.email, password: "password123" } }, as: :json
        token = JSON.parse(response.body)['token']
        # Now attempt registration with that token
        post "/users", params: { user: { email: "new@cuhk.edu.hk", password: "pwd", password_confirmation: "pwd", username: "newuser", community_id: community.id } },
             headers: { "Authorization" => "Bearer #{token}" }, as: :json
        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)['error']).to eq("You are already signed in.")
      end
    end
  end
end
