require 'rails_helper'

RSpec.describe User, type: :model do
  it { should have_many(:items).dependent(:destroy) }
  it { should validate_presence_of(:email) }
  # it { should validate_uniqueness_of(:email).case_insensitive } cross out temp
  it { should allow_value('student@cuhk.edu.hk').for(:email) }
  it { should_not allow_value('student@gmail.com').for(:email) }

  describe 'confirmable' do
    it 'creates unconfirmed user' do
      user = create(:user, confirmed_at: nil)
      expect(user.confirmed?).to be false
    end

    it 'confirms user' do
      user = create(:user, confirmed_at: nil)
      user.confirm
      expect(user.confirmed?).to be true
    end

    it 'sets a jti on creation' do
      user = create(:user)
      expect(user.jti).to be_present
    end
  end
end