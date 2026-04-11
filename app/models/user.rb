class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  belongs_to :community

  include Devise::JWT::RevocationStrategies::JTIMatcher

  validates :community, presence: true
  validates :username, presence: true

  def community_exists
    errors.add(:community, "must exist") unless Community.exists?(community_id)
  end

  def admin?
    role == "admin"
  end

  validate :community_exists
  validate :email_domain_must_be_allowed_cuhk_domain

  has_many :items, dependent: :destroy

  private

  def email_domain_must_be_allowed_cuhk_domain
    return if email.blank?
    return unless email.to_s.count("@") == 1
    return if CuhkEmailDomain.allowed?(email)

    errors.add(:email, "must use an approved CUHK email domain")
  end
end
