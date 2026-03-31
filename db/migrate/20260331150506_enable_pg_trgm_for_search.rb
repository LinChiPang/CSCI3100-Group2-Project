class EnablePgTrgmForSearch < ActiveRecord::Migration[8.1]
  def change
    enable_extension "pg_trgm" unless extension_enabled?("pg_trgm")

    add_index :transactions,
              :item_name,
              using: :gin,
              opclass: :gin_trgm_ops,
              name: "index_transactions_on_item_name_trgm"
  end
end
