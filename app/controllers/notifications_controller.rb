class NotificationsController < ApplicationController
  def index; end

  def broadcast
    # Sanitize user-provided message before broadcasting to clients.
    message = sanitized_message

    ActionCable.server.broadcast(
      "notifications",
      { message: message, sent_at: Time.current.strftime("%Y-%m-%d %H:%M:%S HKT") }
    )

    respond_to do |format|
      format.html { redirect_to notifications_path, notice: "Notification broadcasted." }
      format.json { head :ok }
    end
  end

  private

  def notification_params
    params.permit(:message)
  end

  def sanitized_message
    raw_message = notification_params[:message].to_s
    cleaned = helpers.strip_tags(raw_message).squish
    cleaned.presence || "Test notification from ActionCable"
  end
end
