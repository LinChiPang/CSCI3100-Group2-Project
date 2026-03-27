class Item < ApplicationRecord
  belongs_to :user
  belongs_to :community

  STATUSES = { available: 0, reserved: 1, sold: 2 }.freeze

  after_initialize :set_default_status, if: :new_record?

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true, inclusion: { in: STATUSES.keys.map(&:to_s) }

  # Custom getter and setter for status
  def status
    STATUSES.key(super).to_s
  end

  def status=(value)
    super(STATUSES[value.to_sym])
  end

  # Convenience methods
  def available?
    status == 'available'
  end

  def reserved?
    status == 'reserved'
  end

  def sold?
    status == 'sold'
  end

  # Scopes
  scope :available, -> { where(status: STATUSES[:available]) }
  scope :reserved,  -> { where(status: STATUSES[:reserved]) }
  scope :sold,      -> { where(status: STATUSES[:sold]) }

  # Status transition methods
  def reserve!
    update!(status: 'reserved') if available?
  end

  def sell!
    update!(status: 'sold') if reserved?
  end

  private

  def set_default_status
    self.status = :available if status.nil?
  end
end