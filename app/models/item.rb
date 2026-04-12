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
    broadcast_notification_safe(
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
    broadcast_notification_safe(
      "notifications_user_#{user_id}",
      { type: "item_sold", message: "Your item \"#{title}\" has been marked as sold!", sent_at: Time.current.strftime("%H:%M") }
    )
  end

  scope :available, -> { where(status: :available) }
  scope :reserved, -> { where(status: :reserved) }
  scope :sold, -> { where(status: :sold) }

  private

  # Real-time notifications must never fail the HTTP request: the DB update is already
  # committed when this runs. On Heroku, Solid Cable / DB cable config issues often
  # raise here while the reservation/sale itself succeeded (user sees 500 + stale UI
  # until refresh).
  def broadcast_notification_safe(stream, payload)
    ActionCable.server.broadcast(stream, payload)
  rescue StandardError => e
    Rails.logger.warn("ActionCable broadcast skipped (#{stream}): #{e.class}: #{e.message}")
  end

  def seller_belongs_to_community
    return if user.blank? || community.blank?
    return if user.community_id == community_id

    errors.add(:community, "must match seller's community")
  end

  def category_allowed_by_community_rules
    return if community.blank? || category.blank?

    rule = community.community_rule
    return if rule.nil? || rule.allowed_categories.blank?
    return if rule.category_allowed?(category)

    errors.add(:category, "'#{category}' is not allowed in this community")
  end
end
