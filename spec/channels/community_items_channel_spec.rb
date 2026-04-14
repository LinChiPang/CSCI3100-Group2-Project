require "rails_helper"

RSpec.describe CommunityItemsChannel, type: :channel do
  let(:user) { create(:user) }

  it "streams item updates for the authenticated user's community" do
    stub_connection current_user: user

    subscribe

    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("community_items_#{user.community_id}")
  end

  it "rejects unauthenticated connections" do
    stub_connection current_user: nil

    subscribe

    expect(subscription).to be_rejected
  end
end
