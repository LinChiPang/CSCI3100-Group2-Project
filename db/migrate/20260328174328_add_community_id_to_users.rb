class AddCommunityIdToUsers < ActiveRecord::Migration[8.1]
  def change
    add_reference :users, :community, null: false, foreign_key: true
  end
end
