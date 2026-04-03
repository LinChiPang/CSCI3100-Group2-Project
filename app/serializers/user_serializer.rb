class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :username, :community_id, :created_at
end
