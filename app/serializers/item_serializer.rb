class ItemSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :price, :status, :category, :reserved_by_id, :created_at, :updated_at
  belongs_to :user
  belongs_to :community
end
