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

ActiveRecord::Schema[8.1].define(version: 2026_03_31_130500) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

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

  create_table "transactions", force: :cascade do |t|
    t.integer "amount_cents", null: false
    t.datetime "created_at", null: false
    t.string "currency", default: "HKD", null: false
    t.string "item_name", null: false
    t.string "provider", default: "stripe_mock", null: false
    t.string "provider_ref", null: false
    t.string "status", default: "succeeded", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_transactions_on_created_at"
    t.index ["provider_ref"], name: "index_transactions_on_provider_ref", unique: true
  end

  add_foreign_key "community_rules", "communities"
end
