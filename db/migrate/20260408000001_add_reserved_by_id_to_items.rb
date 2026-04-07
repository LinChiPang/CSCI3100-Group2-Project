class AddReservedByIdToItems < ActiveRecord::Migration[8.1]
  def change
    add_reference :items, :reserved_by, foreign_key: { to_table: :users }, null: true
  end
end
