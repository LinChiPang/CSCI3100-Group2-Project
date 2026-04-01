class Item < ApplicationRecord
  belongs_to :user
  belongs_to :community

  enum :status, { available: 0, reserved: 1, sold: 2 }, prefix: true

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :category, presence: true
  validates :status, inclusion: { in: statuses.keys }

  before_validation :normalize_category

  scope :active_marketplace, -> { where(status: %i[available reserved]) }

  validate :seller_belongs_to_community
  validate :category_allowed_by_community_rule
  validate :price_within_community_limit
  validate :posting_enabled_for_community, on: :create
  validate :within_max_active_listings_limit, on: :create

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

  def with_applicable_rule
    rule = community&.community_rule
    return if rule.blank?

    yield rule
  end

  def normalize_category
    self.category = category.to_s.strip.downcase
  end

  def seller_belongs_to_community
    return if user.blank? || community.blank?
    return if user.community_id == community_id

    errors.add(:community, "must match seller's community")
  end

  def posting_enabled_for_community
    with_applicable_rule do |rule|
      return if rule.posting_enabled?

      errors.add(:base, "posting is disabled for this community")
    end
  end

  def price_within_community_limit
    with_applicable_rule do |rule|
      return if rule.max_price.blank?
      return if price.blank?
      return if price <= rule.max_price

      errors.add(:price, "exceeds the community price cap")
    end
  end

  def category_allowed_by_community_rule
    with_applicable_rule do |rule|
      return if category.blank?
      return if rule.category_allowed?(category)

      errors.add(:category, "is not allowed in this community")
    end
  end

  def within_max_active_listings_limit
    return if user.blank? || community.blank?

    with_applicable_rule do |rule|
      return if current_active_listing_count < rule.max_active_listings

      errors.add(:base, "has reached the community active listing limit")
    end
  end

  def current_active_listing_count
    user.items
        .where(community_id: community_id)
        .active_marketplace
        .where.not(id: id)
        .count
  end
end
