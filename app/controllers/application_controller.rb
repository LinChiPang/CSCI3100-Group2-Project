class ApplicationController < ActionController::Base
  include Devise::Controllers::Helpers

  skip_before_action :verify_authenticity_token

  private

  def authenticate_with_token!
    token = request.headers["Authorization"].to_s.gsub("Bearer ", "")
    secret = ENV["JWT_SECRET"] || Rails.application.credentials.jwt_secret || "your_secret_key_here"
    begin
      payload = JWT.decode(token, secret, true, algorithm: "HS256")
      user_id = payload[0]["sub"]
      @current_user = User.find(user_id)
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end

  def require_admin!
    authenticate_with_token!
    return if performed?
    unless @current_user&.admin?
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end
end
