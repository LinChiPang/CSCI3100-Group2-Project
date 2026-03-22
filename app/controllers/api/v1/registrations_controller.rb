class Api::V1::RegistrationsController < Devise::RegistrationsController
    skip_before_action :verify_authenticity_token, only: [:create]
    respond_to :json
  
    def create
      build_resource(sign_up_params)
  
      resource.save
      yield resource if block_given?
  
      if resource.persisted?
        if resource.active_for_authentication?
          sign_up(resource_name, resource)
          render json: {
            user: UserSerializer.new(resource).serializable_hash,
            token: request.env['warden-jwt_auth.token']
          }, status: :created
        else
          render json: { message: 'User created successfully. Please confirm your email.' }, status: :created
        end
      else
        clean_up_passwords resource
        set_minimum_password_length
        render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end