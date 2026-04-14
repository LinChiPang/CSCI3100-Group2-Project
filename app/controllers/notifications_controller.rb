class NotificationsController < ApplicationController
  before_action :authenticate_with_token!, only: :broadcast

  def index; end

  def broadcast
    return if performed?

    message = params[:message].to_s.strip
    message = "Test notification from ActionCable" if message.blank?

    ActionCable.server.broadcast(
      "notifications_user_#{@current_user.id}",
      { message: message, sent_at: Time.current.strftime("%Y-%m-%d %H:%M:%S") }
    )

    respond_to do |format|
      format.html { redirect_to notifications_path, notice: "Notification broadcasted." }
      format.json { head :ok }
    end
  end
end
