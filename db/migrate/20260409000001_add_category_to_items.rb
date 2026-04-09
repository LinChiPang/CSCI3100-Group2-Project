class AddCategoryToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :category, :string
    add_index :items, :category
  end
end
