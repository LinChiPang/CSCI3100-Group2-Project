class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    if connection.current_user
      stream_from "notifications_user_#{connection.current_user.id}"
    else
      reject
    end
  end
end
