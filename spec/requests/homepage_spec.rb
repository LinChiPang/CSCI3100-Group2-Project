require "rails_helper"

RSpec.describe "Homepage", type: :request do
  it "renders the welcome page" do
    get "/"
    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Hello World")
  end
end
