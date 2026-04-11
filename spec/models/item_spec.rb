require 'rails_helper'

RSpec.describe Item, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:community) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:price) }
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

    it "persists reservation when Action Cable broadcast fails" do
      buyer = create(:user, community: community)
      allow(ActionCable.server).to receive(:broadcast).and_raise(StandardError, "cable down")

      expect { item.reserve!(actor: buyer) }.not_to raise_error
      expect(item.reload).to be_status_reserved
      expect(item.reserved_by_id).to eq(buyer.id)
    end

    it "persists sale when Action Cable broadcast fails" do
      buyer = create(:user, community: community)
      item.reserve!(actor: buyer)
      allow(ActionCable.server).to receive(:broadcast).and_raise(StandardError, "cable down")

      expect { item.sell! }.not_to raise_error
      expect(item.reload).to be_status_sold
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
        status: :available,
        user: seller,
        community: other_community
      )

      expect(invalid_item).not_to be_valid
      expect(invalid_item.errors.full_messages.join).to include("match seller")
    end
  end
end
