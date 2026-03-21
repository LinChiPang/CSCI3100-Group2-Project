class Api::V1::SessionsController < Devise::SessionsController
    skip_before_action :verify_signed_out_user, only: :destroy
    respond_to :json
  
    def create
      self.resource = warden.authenticate!(auth_options)
      sign_in(resource_name, resource)
      render json: {
        user: UserSerializer.new(resource).serializable_hash,
        token: request.env['warden-jwt_auth.token']
      }, status: :ok
    end
  
    def destroy
      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      render json: { message: 'Logged out successfully' }, status: :ok
    end
  end