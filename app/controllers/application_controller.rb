class ApplicationController < ActionController::Base
  include Devise::Controllers::Helpers

  private

  def authenticate_with_token!
    token = request.headers['Authorization'].to_s.gsub('Bearer ', '')
    secret = 'your_secret_key_here'   # use same secret as in devise.rb
    begin
      payload = JWT.decode(token, secret, true, algorithm: 'HS256')
      user_id = payload[0]['sub']
      @current_user = User.find(user_id)
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end
end