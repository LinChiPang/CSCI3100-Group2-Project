require "rails_helper"

RSpec.describe "Notifications", type: :request do
  let(:user) { create(:user) }

  it "renders notifications page" do
    get "/notifications"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Real-time Notifications")
  end

  it "broadcasts notification to the authenticated user's stream and redirects back for html" do
    expect(ActionCable.server).to receive(:broadcast).with(
      "notifications_user_#{user.id}",
      hash_including(message: "Hello", sent_at: kind_of(String))
    )

    post "/notifications/broadcast",
         params: { message: "Hello" },
         headers: { "Authorization" => "Bearer #{token_for(user)}" }

    expect(response).to redirect_to("/notifications")
  end

  it "rejects broadcast without an authenticated SPA token" do
    post "/notifications/broadcast", params: { message: "Hello" }

    expect(response).to have_http_status(:unauthorized)
  end
end
