class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :username, :community_id, :role, :created_at
end
