class Transaction < ApplicationRecord
  belongs_to :community

  validates :item_name, presence: true
  validates :amount_cents, numericality: { greater_than: 0 }
  validates :currency, presence: true
  validates :status, presence: true
  validates :provider, presence: true
  validates :provider_ref, presence: true, uniqueness: true
end
