require "rails_helper"

RSpec.describe "Marketplace schema" do
  let(:connection) { ActiveRecord::Base.connection }

  it "creates communities with non-null name and slug columns" do
    columns = connection.columns(:communities).index_by(&:name)

    expect(columns["name"].null).to be(false)
    expect(columns["slug"].null).to be(false)
  end

  it "creates unique indexes on communities.name and communities.slug" do
    indexes = connection.indexes(:communities)

    name_index = indexes.find { |index| index.columns == [ "name" ] }
    slug_index = indexes.find { |index| index.columns == [ "slug" ] }

    expect(name_index&.unique).to be(true)
    expect(slug_index&.unique).to be(true)
  end

  it "creates community_rules with a unique community reference" do
    indexes = connection.indexes(:community_rules)
    community_index = indexes.find { |index| index.columns == [ "community_id" ] }

    expect(community_index&.unique).to be(true)
  end

  it "creates allowed_categories as a real column on community_rules" do
    columns = connection.columns(:community_rules).index_by(&:name)

    expect(columns).to have_key("allowed_categories")
    expect(columns["allowed_categories"].null).to be(false)
  end
end
