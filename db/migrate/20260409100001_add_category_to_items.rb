class AddCategoryToItems < ActiveRecord::Migration[8.0]
  def change
    add_column :items, :category, :string
    add_index :items, :category
  end
end
