class NotificationsController < ApplicationController
  def index; end

  def broadcast
    message = params[:message].to_s.strip
    message = "Test notification from ActionCable" if message.blank?

    ActionCable.server.broadcast(
      "notifications",
      { message: message, sent_at: Time.current.strftime("%Y-%m-%d %H:%M:%S") }
    )

    respond_to do |format|
      format.html { redirect_to notifications_path, notice: "Notification broadcasted." }
      format.json { head :ok }
    end
  end
end
