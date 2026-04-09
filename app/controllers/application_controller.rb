class ApplicationController < ActionController::Base
  include Devise::Controllers::Helpers
  include JwtTokenIssuer

  skip_before_action :verify_authenticity_token

  private

  def render_frontend_spa!
    frontend_index = Rails.root.join("public", "frontend", "index.html")

    unless File.exist?(frontend_index)
      render plain: "Frontend build is missing. Rebuild the frontend into public/frontend before starting Rails.",
             status: :service_unavailable
      return
    end

    render file: frontend_index, layout: false
  end

  def authenticate_with_token!
    token = request.headers["Authorization"].to_s.gsub("Bearer ", "")
    begin
      payload = JWT.decode(token, jwt_secret, true, algorithms: ["HS256"])
      user_id = payload[0]["sub"]
      @current_user = User.find(user_id)

      unless payload[0]["jti"] == @current_user.jti
        render json: { error: "Invalid token" }, status: :unauthorized
      end
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
