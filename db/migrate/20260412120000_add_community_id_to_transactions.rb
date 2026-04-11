class AddCommunityIdToTransactions < ActiveRecord::Migration[8.1]
  def up
    add_reference :transactions, :community, foreign_key: true, null: true, index: false

    reversible do |dir|
      dir.up do
        execute <<~SQL.squish
          UPDATE transactions AS t
          SET community_id = i.community_id
          FROM items AS i
          WHERE t.community_id IS NULL
            AND i.title = t.item_name
        SQL
      end
    end

    add_index :transactions, [ :community_id, :created_at ], name: "index_transactions_on_community_id_and_created_at"
  end

  def down
    remove_index :transactions, name: "index_transactions_on_community_id_and_created_at", if_exists: true
    remove_reference :transactions, :community, foreign_key: true
  end
end
