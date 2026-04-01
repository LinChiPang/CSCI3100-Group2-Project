class AddCategoryToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :category, :string, null: false, default: "books"
    add_index :items, :category

    change_column_default :items, :category, from: "books", to: nil
  end
end
