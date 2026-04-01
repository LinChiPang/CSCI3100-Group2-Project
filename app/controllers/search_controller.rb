class SearchController < ApplicationController
  ITEMS = [
    "Desk Lamp",
    "Office Chair",
    "Rice Cooker",
    "Keyboard",
    "Monitor",
    "Bicycle Helmet",
    "Water Bottle",
    "Textbook: Algorithms",
    "USB-C Charger",
    "Bluetooth Speaker"
  ].freeze

  def index; end

  def suggestions
    query = params[:q].to_s.strip
    return render json: { suggestions: [] } if query.blank?

    suggestions = pg_trgm_suggestions(query)
    suggestions = in_memory_suggestions(query) if suggestions.empty?

    render json: { suggestions: suggestions.first(5) }
  end

  private

  def pg_trgm_suggestions(query)
    Transaction
      .select(:item_name)
      .distinct
      .where("item_name % ?", query)
      .order(Arel.sql("similarity(item_name, #{ActiveRecord::Base.connection.quote(query)}) DESC"))
      .limit(5)
      .pluck(:item_name)
  rescue ActiveRecord::StatementInvalid
    []
  end

  def in_memory_suggestions(query)
    normalized = query.downcase
    ITEMS
      .sort_by do |item|
        candidate = item.downcase
        [
          candidate.include?(normalized) ? 0 : 1,
          levenshtein_distance(candidate, normalized),
          candidate.length
        ]
      end
  end

  # Lightweight fuzzy ranking without extra gems.
  def levenshtein_distance(a, b)
    return b.length if a.empty?
    return a.length if b.empty?

    prev_row = (0..b.length).to_a
    a.chars.each_with_index do |a_char, i|
      current_row = [ i + 1 ]
      b.chars.each_with_index do |b_char, j|
        insert_cost = current_row[j] + 1
        delete_cost = prev_row[j + 1] + 1
        replace_cost = prev_row[j] + (a_char == b_char ? 0 : 1)
        current_row << [ insert_cost, delete_cost, replace_cost ].min
      end
      prev_row = current_row
    end
    prev_row.last
  end
end
