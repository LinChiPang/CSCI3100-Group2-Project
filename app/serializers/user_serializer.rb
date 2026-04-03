class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at, :username, :created_at
end
