require "rails_helper"

RSpec.describe "Admin analytics", type: :request do
  it "renders analytics dashboard" do
    get "/admin/analytics"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Admin Analytics Dashboard")
    expect(response.body).to include("Total transactions")
  end
end
