require "rails_helper"

RSpec.describe "Notifications", type: :request do
  it "renders notifications page" do
    get "/notifications"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Real-time Notifications")
  end

  it "broadcasts notification and redirects back" do
    post "/notifications/broadcast", params: { message: "Payment succeeded" }

    expect(response).to redirect_to("/notifications")
  end
end
