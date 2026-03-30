require 'rails_helper'

RSpec.describe Item, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:community) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:price) }
  it { should validate_numericality_of(:price).is_greater_than_or_equal_to(0) }

  describe 'status transitions' do
    let(:user) { create(:user) }
    let(:community) { create(:community) }
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
  end
end
