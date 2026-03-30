class SessionsController < Devise::SessionsController
  # skip_before_action :verify_authenticity_token, only: [:create, :destroy]
  skip_before_action :verify_signed_out_user, only: :destroy
  # skip_before_action :require_no_authentication, only: [:create]
  respond_to :json

  def create
    self.resource = warden.authenticate(auth_options)
    if resource && resource.active_for_authentication?
      sign_in(resource_name, resource)
      secret = ENV["JWT_SECRET"] || Rails.application.credentials.jwt_secret || "your_secret_key_here"
      payload = {
        sub: resource.id,
        jti: resource.jti,
        exp: 1.day.from_now.to_i
      }
      token = JWT.encode(payload, secret, "HS256")
      render json: {
        user: UserSerializer.new(resource).serializable_hash,
        token: token
      }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    render json: { message: "Logged out successfully" }, status: :ok
  end
end
