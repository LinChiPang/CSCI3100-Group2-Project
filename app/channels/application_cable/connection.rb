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

      payload = JWT.decode(token, jwt_secret, true, algorithm: "HS256")
      user_id = payload[0]["sub"]
      user = User.find(user_id)
      return reject_unauthorized_connection unless payload[0]["jti"] == user.jti

      user
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      reject_unauthorized_connection
    end

    def jwt_secret
      ENV["JWT_SECRET"].presence ||
        (Rails.application.credentials.jwt_secret rescue nil) ||
        Rails.application.secret_key_base
    end
  end
end
