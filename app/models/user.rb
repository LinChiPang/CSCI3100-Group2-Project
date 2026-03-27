class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  include Devise::JWT::RevocationStrategies::JTIMatcher

  def self.jwt_revocation_strategy
    Devise::JWT::RevocationStrategies::JTIMatcher
  end

  validates :email, format: { with: /\A[\w+\-.]+@cuhk\.edu\.hk\z/i, message: "must be a CUHK email" }

  has_many :items, dependent: :destroy
end