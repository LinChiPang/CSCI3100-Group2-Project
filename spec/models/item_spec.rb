require 'rails_helper'

RSpec.describe Item, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:community) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:price) }
  it { should validate_presence_of(:category) }
  it { should validate_numericality_of(:price).is_greater_than_or_equal_to(0) }

  describe 'status transitions' do
    let(:user) { create(:user) }
    let(:community) { user.community }
    let(:item) { create(:item, user: user, community: community, status: 'available') }

    it 'can be reserved' do
      expect { item.reserve! }.to change { item.status }.to('reserved')
    end

    it 'can be sold after reservation' do
      item.reserve!
      expect { item.sell! }.to change { item.status }.to('sold')
    end

    it 'cannot be sold directly from available' do
      expect { item.sell! }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it 'cannot be reserved when already reserved' do
      item.reserve!
      expect { item.reserve! }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it 'cannot be reserved by a user from another community' do
      outsider = create(:user)
      expect { item.reserve!(actor: outsider) }.to raise_error(ActiveRecord::RecordInvalid)
      expect(item.errors.full_messages.join).to include("another community")
    end

    it 'cannot be sold by a non-owner actor' do
      actor = create(:user, community: community)
      item.reserve!(actor: actor)
      expect { item.sell!(actor: actor) }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end

  describe 'community consistency' do
    it 'requires the seller and item to share the same community' do
      seller = create(:user)
      other_community = create(:community)
      invalid_item = Item.new(
        title: "Cross-community item",
        description: "invalid",
        price: 100,
        category: "books",
        status: :available,
        user: seller,
        community: other_community
      )

      expect(invalid_item).not_to be_valid
      expect(invalid_item.errors.full_messages.join).to include("match seller")
    end
  end

  describe "community rule enforcement" do
    let(:community) { create(:community) }
    let(:user) { create(:user, community: community) }
    let!(:rule) do
      create(
        :community_rule,
        community: community,
        posting_enabled: true,
        max_price: 200,
        max_active_listings: 2,
        allowed_categories: %w[books electronics]
      )
    end

    it "normalizes category before validation" do
      item = build(:item, user: user, community: community, category: " Books ")

      item.validate

      expect(item.category).to eq("books")
    end

    it "rejects a disallowed category" do
      item = build(:item, user: user, community: community, category: "furniture")

      expect(item).not_to be_valid
      expect(item.errors[:category]).to include("is not allowed in this community")
    end

    it "rejects a price above the community cap" do
      item = build(:item, user: user, community: community, category: "books", price: 250)

      expect(item).not_to be_valid
      expect(item.errors[:price]).to include("exceeds the community price cap")
    end

    it "rejects item creation when posting is disabled" do
      rule.update!(posting_enabled: false)
      item = build(:item, user: user, community: community, category: "books")

      expect(item).not_to be_valid
      expect(item.errors[:base]).to include("posting is disabled for this community")
    end

    it "rejects item creation when the active listing limit is reached" do
      create(:item, user: user, community: community, category: "books", status: :available)
      create(:item, user: user, community: community, category: "electronics", status: :reserved)
      item = build(:item, user: user, community: community, category: "books")

      expect(item).not_to be_valid
      expect(item.errors[:base]).to include("has reached the community active listing limit")
    end

    it "does not count sold items toward the active listing limit" do
      create(:item, user: user, community: community, category: "books", status: :sold)
      item = build(:item, user: user, community: community, category: "books")

      expect(item).to be_valid
    end
  end
end
