class ItemPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    same_community?
  end

  def create?
    user.present?
  end

  def update?
    user.present? && same_community? && record.user_id == user.id
  end

  def destroy?
    update?
  end

  def reserve?
    user.present? && same_community? && record.user_id != user.id && record.status_available?
  end

  def sell?
    user.present? && same_community? && record.user_id == user.id && record.status_reserved?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.none if user.blank?

      scope.where(community_id: user.community_id)
    end
  end

  private

  def same_community?
    record.community_id == user.community_id
  end
end
