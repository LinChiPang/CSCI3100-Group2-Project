require "rails_helper"

RSpec.describe "Homepage", type: :request do
  let(:frontend_index) { Rails.root.join("public", "frontend", "index.html") }

  it "serves the SPA shell at the root path" do
    get "/"

    expect(response).to have_http_status(:ok)
    expect(response.media_type).to eq("text/html")
    expect(response.body).to include('<div id="app"></div>')
    expect(response.body).not_to include("Hello World")
  end

  it "serves the SPA shell for login" do
    get "/login"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include('<div id="app"></div>')
  end

  it "serves the SPA shell for community routes" do
    get "/c/test-community"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include('<div id="app"></div>')
  end

  it "returns a clear error if the frontend build is missing" do
    allow(File).to receive(:exist?).and_call_original
    allow(File).to receive(:exist?).with(frontend_index).and_return(false)

    get "/"

    expect(response).to have_http_status(:service_unavailable)
    expect(response.body).to include("Frontend build is missing")
  end

  it "does not route JSON API requests to the SPA shell" do
    get "/communities", as: :json

    expect(response).to have_http_status(:ok)
    expect(response.media_type).to eq("application/json")
    expect(response.body).not_to include('<div id="app"></div>')
  end
end
