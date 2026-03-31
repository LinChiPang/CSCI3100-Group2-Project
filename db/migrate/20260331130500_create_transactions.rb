class CreateTransactions < ActiveRecord::Migration[8.1]
  def change
    create_table :transactions do |t|
      t.string :item_name, null: false
      t.integer :amount_cents, null: false
      t.string :currency, null: false, default: "HKD"
      t.string :status, null: false, default: "succeeded"
      t.string :provider, null: false, default: "stripe_mock"
      t.string :provider_ref, null: false

      t.timestamps
    end

    add_index :transactions, :provider_ref, unique: true
    add_index :transactions, :created_at
  end
end

