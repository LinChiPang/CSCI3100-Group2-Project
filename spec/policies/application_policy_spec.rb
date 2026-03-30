require 'rails_helper'

RSpec.describe ApplicationPolicy do
  let(:user) { create(:user) }
  let(:record) { double('record') }
  subject { described_class.new(user, record) }

  it "initializes with user and record" do
    expect(subject.user).to eq(user)
    expect(subject.record).to eq(record)
  end

  describe "default permissions" do
    it { expect(subject.index?).to be false }
    it { expect(subject.show?).to be false }
    it { expect(subject.create?).to be false }
    it { expect(subject.new?).to be false }
    it { expect(subject.update?).to be false }
    it { expect(subject.edit?).to be false }
    it { expect(subject.destroy?).to be false }
  end

  describe "Scope" do
    let(:scope) { User }   # a real ActiveRecord class
    let(:scope_instance) { described_class::Scope.new(user, scope) }

    it "initializes with user and scope" do
      expect(scope_instance.user).to eq(user)
      expect(scope_instance.scope).to eq(scope)
    end

    it "returns scope.all when resolve is called" do
      expect(scope_instance.resolve).to eq(scope.all)
    end
  end
end
