class ItemPolicy < ApplicationPolicy
  # NOTE: Up to Pundit v2.3.1, the inheritance was declared as
  # `Scope < Scope` rather than `Scope < ApplicationPolicy::Scope`.
  # In most cases the behavior will be identical, but if updating existing
  # code, beware of possible changes to the ancestors:
  # https://gist.github.com/Burgestrand/4b4bc22f31c8a95c425fc0e30d7ef1f5
  def index?
    true
  end

  def show?
    true
  end

  def create?
    user.present?  # any authenticated user can create
  end

  def update?
    user.present? && (record.user == user || user.admin?)
  end

  def destroy?
    user.present? && (record.user == user || user.admin?)
  end

  def reserve?
    user.present? && record.user != user && record.available?
  end

  def sell?
    user.present? && record.user == user && record.reserved?
  end

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
    def resolve
      if user.admin?
        scope.all
      else
        # Users can see items in communities they belong to
        # But for now, show all items (we'll refine later when Community is implemented)
        scope.all
      end
    end
  end
end
