class CreateCommunities < ActiveRecord::Migration[8.1]
  def change
    create_table :communities do |t|
      t.string :name, null: false
      t.string :slug, null: false

      t.timestamps
    end

    add_index :communities, :name, unique: true
    add_index :communities, :slug, unique: true
  end
end
