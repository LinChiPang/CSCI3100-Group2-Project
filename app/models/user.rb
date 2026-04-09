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

  validates :email, format: { with: /\A[\w+\-.]+@cuhk\.edu\.hk\z/i, message: "must be a CUHK email" }

  has_many :items, dependent: :destroy
end
