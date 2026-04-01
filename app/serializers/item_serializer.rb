class ItemSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :price, :category, :status, :created_at, :updated_at
  belongs_to :user
  belongs_to :community
end
