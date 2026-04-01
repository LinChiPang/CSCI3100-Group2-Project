class Item < ApplicationRecord
  belongs_to :user
  belongs_to :community

  enum :status, { available: 0, reserved: 1, sold: 2 }, prefix: true

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: statuses.keys }
  validate :seller_belongs_to_community

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

    update!(status: :reserved)
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

    update!(status: :sold)
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
end
