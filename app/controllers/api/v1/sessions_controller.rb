class Api::V1::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token, only: [:create, :destroy]
  skip_before_action :verify_signed_out_user, only: :destroy
  skip_before_action :require_no_authentication, only: [:create]
  respond_to :json

  before_action :set_devise_mapping, only: [:create, :destroy]

  def create
    user = User.find_by(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      # Check confirmation (if confirmable is enabled)
      if user.confirmed?
        # Sign in the user (updates last_sign_in_at, etc.)
        sign_in(:user, user)

        # Generate JWT token
        token = generate_jwt_token(user)

        render json: {
          user: UserSerializer.new(user).serializable_hash,
          token: token
        }, status: :ok
      else
        render json: { error: 'Please confirm your email before logging in' }, status: :unauthorized
      end
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    render json: { message: 'Logged out successfully' }, status: :ok
  end

  private

  def set_devise_mapping
    request.env["devise.mapping"] = Devise.mappings[:user]
  end

  def generate_jwt_token(user)
    # Use the same JWT secret as in config/initializers/devise.rb
    secret = Rails.application.credentials.devise_jwt_secret_key || 'your_secret_key_here'

    payload = {
      sub: user.id,
      jti: user.jti,
      exp: 1.day.from_now.to_i
    }

    JWT.encode(payload, secret, 'HS256')
  end
end