FactoryBot.define do
  factory :community do
    sequence(:name) { |n| "Community #{n}" }
    sequence(:slug) { |n| "community-#{n}" }
  end
end