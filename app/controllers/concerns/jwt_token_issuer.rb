module JwtTokenIssuer
  extend ActiveSupport::Concern

  private

  def jwt_token_for(user)
    payload = {
      sub: user.id,
      scp: "user",
      jti: user.jti,
      exp: 1.day.from_now.to_i
    }

    JWT.encode(payload, jwt_secret, "HS256")
  end

  def jwt_secret
    ENV["JWT_SECRET"].presence ||
      (Rails.application.credentials.jwt_secret rescue nil) ||
      Rails.application.secret_key_base
  end
end
