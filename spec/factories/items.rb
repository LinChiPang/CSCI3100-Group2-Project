FactoryBot.define do
  factory :item do
    title { "Test Item" }
    description { "Test description" }
    price { 100.00 }
    category { "books" }
    status { "available" }
    association :user
    community { user&.community || association(:community) }

    after(:build) do |item|
      next if item.user.blank? || item.community.blank?
      next if item.user.community_id == item.community_id

      item.user.community = item.community
    end
  end
end
