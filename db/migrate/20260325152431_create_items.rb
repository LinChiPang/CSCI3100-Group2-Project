class CreateItems < ActiveRecord::Migration[8.1]
  def change
    create_table :items do |t|
      t.string :title, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :status, default: 0, null: false
      t.references :user, null: false, foreign_key: true
      t.references :community, null: false, foreign_key: true

      t.timestamps
    end

    add_index :items, :status
    # No need to add index on community_id – it's already created by t.references
  end
end
