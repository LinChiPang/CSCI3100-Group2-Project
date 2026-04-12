class CommunityItemsChannel < ApplicationCable::Channel
  def subscribed
    if connection.current_user
      stream_from "community_items_#{connection.current_user.community_id}"
    else
      reject
    end
  end
end
