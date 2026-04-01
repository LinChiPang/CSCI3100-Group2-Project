require 'rails_helper'

RSpec.describe ItemPolicy, type: :policy do
  let(:community) { create(:community) }
  let(:owner) { create(:user, community: community) }
  let(:member) { create(:user, community: community) }
  let(:outsider) { create(:user) }
  let(:item) { create(:item, user: owner, community: community, status: "available") }

  describe "permissions" do
    it "allows create for authenticated users" do
      expect(described_class.new(member, item).create?).to eq(true)
    end

    it "allows owner update/destroy and blocks other members" do
      expect(described_class.new(owner, item).update?).to eq(true)
      expect(described_class.new(member, item).update?).to eq(false)
      expect(described_class.new(owner, item).destroy?).to eq(true)
      expect(described_class.new(member, item).destroy?).to eq(false)
    end

    it "blocks outsider from show and reserve" do
      expect(described_class.new(outsider, item).show?).to eq(false)
      expect(described_class.new(outsider, item).reserve?).to eq(false)
    end
  end

  describe "scope" do
    it "returns only same-community items" do
      visible_item = create(:item, community: community, user: owner)
      hidden_item = create(:item)

      resolved = described_class::Scope.new(member, Item.all).resolve
      expect(resolved).to include(visible_item)
      expect(resolved).not_to include(hidden_item)
    end
  end
end
