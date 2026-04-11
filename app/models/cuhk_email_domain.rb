class CuhkEmailDomain
  ALLOWED_DOMAINS = %w[
    cuhk.edu.hk
    link.cuhk.edu.hk
    ee.cuhk.edu.hk
    cse.cuhk.edu.hk
    ie.cuhk.edu.hk
    math.cuhk.edu.hk
    bme.cuhk.edu.hk
    phy.cuhk.edu.hk
    mae.cuhk.edu.hk
    seem.cuhk.edu.hk
  ].freeze

  def self.allowed?(email)
    domain = domain_from(email)
    domain.present? && ALLOWED_DOMAINS.include?(domain)
  end

  def self.domain_from(email)
    parts = email.to_s.split("@", -1)
    return nil unless parts.length == 2

    parts.last.downcase
  end
end
