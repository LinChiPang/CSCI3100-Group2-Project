FactoryBot.define do
  factory :item do
    title { "MyString" }
    description { "MyText" }
    price { "9.99" }
    status { 1 }
    user { nil }
    community { nil }
  end
end
