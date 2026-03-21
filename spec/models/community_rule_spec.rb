require "rails_helper"

RSpec.describe CommunityRule, type: :model do
  subject(:community_rule) { build(:community_rule) }

  it { is_expected.to belong_to(:community) }

  it do
    is_expected.to validate_numericality_of(:max_active_listings)
      .only_integer
      .is_greater_than_or_equal_to(1)
  end

  it "normalizes allowed categories" do
    community_rule.allowed_categories = [ " Books ", "books", "Furniture" ]

    community_rule.validate

    expect(community_rule.allowed_categories).to eq(%w[ books furniture ])
  end

  it "allows any category when the allowed list is empty" do
    community_rule.allowed_categories = []

    expect(community_rule.category_allowed?("anything")).to be(true)
  end

  it "accepts an allowed category" do
    community_rule.allowed_categories = %w[ books electronics ]

    expect(community_rule.category_allowed?("Books")).to be(true)
  end

  it "rejects a disallowed category" do
    community_rule.allowed_categories = %w[ books electronics ]

    expect(community_rule.category_allowed?("furniture")).to be(false)
  end
end
