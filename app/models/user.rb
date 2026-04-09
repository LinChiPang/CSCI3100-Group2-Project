class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  before_create :set_jti

  belongs_to :community

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

  private

  def set_jti
    self.jti ||= SecureRandom.uuid
  end
end
