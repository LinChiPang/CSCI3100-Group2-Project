class Item < ApplicationRecord
  belongs_to :user
  belongs_to :community
  belongs_to :reserved_by, class_name: "User", optional: true

  enum :status, { available: 0, reserved: 1, sold: 2 }, prefix: true

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: statuses.keys }
  validates :category, presence: true
  validate :seller_belongs_to_community
  validate :category_allowed_by_community_rules

  def reserve!(actor: nil)
    unless status_available?
      errors.add(:status, "cannot be reserved when not available")
      raise ActiveRecord::RecordInvalid, self
    end

    if actor.present?
      if actor.community_id != community_id
        errors.add(:base, "cannot reserve item from another community")
        raise ActiveRecord::RecordInvalid, self
      end
      if actor.id == user_id
        errors.add(:base, "owner cannot reserve own item")
        raise ActiveRecord::RecordInvalid, self
      end
    end

    update!(status: :reserved, reserved_by: actor)
    ActionCable.server.broadcast(
      "notifications_user_#{user_id}",
      { type: "item_reserved", message: "Your item \"#{title}\" has been reserved by a buyer.", sent_at: Time.current.strftime("%H:%M") }
    )
  end

  def sell!(actor: nil)
    unless status_reserved?
      errors.add(:status, "cannot be sold unless reserved")
      raise ActiveRecord::RecordInvalid, self
    end

    if actor.present? && actor.id != user_id
      errors.add(:base, "only owner can mark item as sold")
      raise ActiveRecord::RecordInvalid, self
    end

    update!(status: :sold, reserved_by: nil)
    ActionCable.server.broadcast(
      "notifications_user_#{user_id}",
      { type: "item_sold", message: "Your item \"#{title}\" has been marked as sold!", sent_at: Time.current.strftime("%H:%M") }
    )
  end

  scope :available, -> { where(status: :available) }
  scope :reserved, -> { where(status: :reserved) }
  scope :sold, -> { where(status: :sold) }

  private

  def seller_belongs_to_community
    return if user.blank? || community.blank?
    return if user.community_id == community_id

    errors.add(:community, "must match seller's community")
  end

  def category_allowed_by_community_rules
    return if category.blank? || community.blank?

    rule = community.community_rule
    return if rule.nil? || rule.allowed_categories.blank?
    return if rule.allowed_categories.include?(category.to_s.strip.downcase)

    errors.add(:category, "is not allowed in this community")
  end
end
