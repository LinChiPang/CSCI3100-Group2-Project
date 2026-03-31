FactoryBot.define do
  factory :item do
    title { "Test Item" }
    description { "Test description" }
    price { 100.00 }
    status { "available" }
    association :user
    association :community
  end
end
