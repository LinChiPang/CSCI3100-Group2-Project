require "rails_helper"

RSpec.describe Community, type: :model do
  subject(:community) { build(:community) }

  it { is_expected.to have_one(:community_rule).dependent(:destroy) }

  it { is_expected.to validate_presence_of(:name) }

  it "requires a slug when the name is blank" do
    community.name = ""
    community.slug = ""

    expect(community).not_to be_valid
    expect(community.errors[:slug]).to be_present
  end

  it "normalizes the slug from the name when slug is blank" do
    community.slug = nil
    community.name = "  New Asia College  "

    community.validate

    expect(community.slug).to eq("new-asia-college")
  end

  it "rejects an invalid slug format" do
    community.slug = "New Asia!"

    expect(community).not_to be_valid
    expect(community.errors[:slug]).to be_present
  end
end
