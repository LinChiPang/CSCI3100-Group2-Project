class CreateCommunityRules < ActiveRecord::Migration[8.1]
  def change
    create_table :community_rules do |t|
      t.references :community, null: false, foreign_key: true, index: { unique: true }
      t.decimal :max_price, precision: 10, scale: 2
      t.integer :max_active_listings, null: false, default: 5
      t.boolean :posting_enabled, null: false, default: true
      t.string :allowed_categories, array: true, null: false, default: []

      t.timestamps
    end
  end
end
