class RegistrationsController < Devise::RegistrationsController
  # skip_before_action :verify_authenticity_token, only: [:create]
  respond_to :json

  before_action :ensure_not_authenticated, only: [ :create ]

  def create
    build_resource(sign_up_params)

    resource.skip_confirmation!
    resource.save
    yield resource if block_given?

    if resource.persisted?
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        render json: {
          user: UserSerializer.new(resource).as_json,
          token: jwt_token_for(resource)
        }, status: :created
      else
        render json: { message: "User created successfully. Please confirm your email." }, status: :created
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def ensure_not_authenticated
    if user_signed_in?
      render json: { error: "You are already signed in." }, status: :forbidden
    end
  end

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :community_id, :username)
  end

  def after_sign_up_path_for(resource)
    # Return nil for JSON requests so Devise doesn't redirect
    nil if request.format == :json
  end
end
