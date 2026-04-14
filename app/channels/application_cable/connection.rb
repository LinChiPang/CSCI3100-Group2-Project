module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # Try JWT auth first (for SPA/authenticated users)
      user = find_user_from_jwt
      return user if user

      # Fallback to Devise session auth (for traditional Rails views like /notifications demo)
      user = find_user_from_session
      return user if user

      reject_unauthorized_connection
    end

    def find_user_from_jwt
      token = request.params[:token] ||
              request.headers["Authorization"].to_s.gsub("Bearer ", "")
      return nil if token.blank?

      payload = JWT.decode(token, jwt_secret, true, algorithm: "HS256")
      user_id = payload[0]["sub"]
      user = User.find(user_id)
      return nil unless payload[0]["jti"] == user.jti

      user
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      nil
    end

    def find_user_from_session
      # Try to get user from Devise/Warden session
      warden = request.env["warden"]
      return warden.user if warden&.user.present?

      nil
    rescue StandardError
      nil
    end

    def jwt_secret
      ENV["JWT_SECRET"].presence ||
        (Rails.application.credentials.jwt_secret rescue nil) ||
        Rails.application.secret_key_base
    end
  end
end
