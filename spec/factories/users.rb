FactoryBot.define do
    factory :user do
      sequence(:email) { |n| "user#{n}@cuhk.edu.hk" }
      password { "password123" }
      password_confirmation { "password123" }
      confirmed_at { Time.now }   # remove or set to nil if confirmable is disabled
      association :community #
    end
  end
