module RequestAuthHelpers
  def token_for(user)
    payload = {
      sub: user.id,
      scp: "user",
      jti: user.jti,
      exp: 1.day.from_now.to_i
    }
    secret = ENV["JWT_SECRET"] || "test_secret_key_for_jwt"

    JWT.encode(payload, secret, "HS256")
  end
end
