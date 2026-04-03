FactoryBot.define do
  factory :community do
    sequence(:name) { |n| "Community #{n}" }
    sequence(:slug) { |n| "community-#{n}" }

    after(:create) do |community|
      create(:community_rule, community: community) unless community.community_rule
    end
  end
end
