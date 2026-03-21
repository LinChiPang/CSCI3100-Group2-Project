class CommunityRule < ApplicationRecord
  belongs_to :community

  validates :max_price,
            numericality: {
              greater_than: 0,
              allow_nil: true
            }

  validates :max_active_listings,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 1
            }

  validate :allowed_categories_are_normalized

  before_validation :normalize_allowed_categories

  def category_allowed?(category)
    normalized_category = normalize_category(category)
    return true if normalized_category.blank?
    return true if allowed_categories.blank?

    allowed_categories.include?(normalized_category)
  end

  private

  def normalize_allowed_categories
    self.allowed_categories = Array(allowed_categories)
                              .map { |category| normalize_category(category) }
                              .reject(&:blank?)
                              .uniq
                              .sort
  end

  def normalize_category(category)
    category.to_s.strip.downcase
  end

  def allowed_categories_are_normalized
    normalized = Array(allowed_categories)
                 .map { |category| normalize_category(category) }
                 .reject(&:blank?)
                 .uniq
                 .sort
    return if allowed_categories == normalized

    errors.add(:allowed_categories, "must be lowercase, trimmed, unique, and sorted")
  end
end
