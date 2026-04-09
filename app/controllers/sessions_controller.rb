class SessionsController < Devise::SessionsController
  # skip_before_action :verify_authenticity_token, only: [:create, :destroy]
  skip_before_action :verify_signed_out_user, only: :destroy
  # skip_before_action :require_no_authentication, only: [:create]
  respond_to :json

  def create
    self.resource = warden.authenticate(auth_options)
    if resource && resource.active_for_authentication?
      sign_in(resource_name, resource)
      render json: {
        user: UserSerializer.new(resource).as_json,
        token: jwt_token_for(resource)
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
