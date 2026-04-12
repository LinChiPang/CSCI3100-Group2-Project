class AddCommunityIdToTransactions < ActiveRecord::Migration[8.1]
  def change
    add_reference :transactions, :community, null: false, foreign_key: true
  end
end
