FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@cuhk.edu.hk" }
    sequence(:username) { |n| "username#{n}" }
    password { "password123" }
    password_confirmation { "password123" }
    confirmed_at { Time.now }
    association :community
  end
end
