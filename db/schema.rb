# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_04_11_195018) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pg_trgm"

  create_table "communities", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_communities_on_name", unique: true
    t.index ["slug"], name: "index_communities_on_slug", unique: true
  end

  create_table "community_rules", force: :cascade do |t|
    t.string "allowed_categories", default: [], null: false, array: true
    t.bigint "community_id", null: false
    t.datetime "created_at", null: false
    t.integer "max_active_listings", default: 5, null: false
    t.decimal "max_price", precision: 10, scale: 2
    t.boolean "posting_enabled", default: true, null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_community_rules_on_community_id", unique: true
  end

  create_table "items", force: :cascade do |t|
    t.string "category"
    t.bigint "community_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.decimal "price", precision: 10, scale: 2, null: false
    t.bigint "reserved_by_id"
    t.integer "status", default: 0, null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["category"], name: "index_items_on_category"
    t.index ["community_id"], name: "index_items_on_community_id"
    t.index ["reserved_by_id"], name: "index_items_on_reserved_by_id"
    t.index ["status"], name: "index_items_on_status"
    t.index ["user_id"], name: "index_items_on_user_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.integer "amount_cents", null: false
    t.bigint "community_id", null: false
    t.datetime "created_at", null: false
    t.string "currency", default: "HKD", null: false
    t.string "item_name", null: false
    t.string "provider", default: "stripe_mock", null: false
    t.string "provider_ref", null: false
    t.string "status", default: "succeeded", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_transactions_on_community_id"
    t.index ["created_at"], name: "index_transactions_on_created_at"
    t.index ["item_name"], name: "index_transactions_on_item_name_trgm", opclass: :gin_trgm_ops, using: :gin
    t.index ["provider_ref"], name: "index_transactions_on_provider_ref", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.datetime "confirmation_sent_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "jti", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.string "role", default: "user", null: false
    t.string "unconfirmed_email"
    t.datetime "updated_at", null: false
    t.string "username", default: "", null: false
    t.index ["community_id"], name: "index_users_on_community_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "community_rules", "communities"
  add_foreign_key "items", "communities"
  add_foreign_key "items", "users"
  add_foreign_key "items", "users", column: "reserved_by_id"
  add_foreign_key "transactions", "communities"
  add_foreign_key "users", "communities"
end
