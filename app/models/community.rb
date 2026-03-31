class Community < ApplicationRecord
  has_one :community_rule, dependent: :destroy
  has_many :users, dependent: :restrict_with_exception
  has_many :items, dependent: :restrict_with_exception

  validates :name,
            presence: true,
            uniqueness: { case_sensitive: false }

  validates :slug,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: {
              with: /\A[a-z0-9-]+\z/,
              message: "must only contain lowercase letters, numbers, and hyphens"
            }

  scope :alphabetical, -> { order(:name) }

  before_validation :normalize_name_and_slug

  private

  def normalize_name_and_slug
    self.name = name.to_s.strip
    self.slug =
      if slug.present?
        slug.to_s.strip
      else
        name.to_s.parameterize
      end
  end
end
