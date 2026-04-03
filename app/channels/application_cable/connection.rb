module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token] ||
              request.headers["Authorization"].to_s.gsub("Bearer ", "")
      return reject_unauthorized_connection if token.blank?

      secret = ENV["JWT_SECRET"] || Rails.application.credentials.jwt_secret || "your_secret_key_here"
      payload = JWT.decode(token, secret, true, algorithm: "HS256")
      user_id = payload[0]["sub"]
      User.find(user_id)
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      reject_unauthorized_connection
    end
  end
end
