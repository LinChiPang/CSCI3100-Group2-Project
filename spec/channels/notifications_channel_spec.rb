require "rails_helper"

RSpec.describe NotificationsChannel, type: :channel do
  let(:user) { create(:user) }

  it "streams notifications for the authenticated user" do
    stub_connection current_user: user

    subscribe

    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("notifications_user_#{user.id}")
  end

  it "rejects unauthenticated connections" do
    stub_connection current_user: nil

    subscribe

    expect(subscription).to be_rejected
  end
end
