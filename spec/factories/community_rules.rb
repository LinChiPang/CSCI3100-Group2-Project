FactoryBot.define do
  factory :community_rule do
    association :community
    max_price { 9.99 }
    max_active_listings { 5 }
    posting_enabled { true }
    allowed_categories { [] }
  end
end
