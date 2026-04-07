class SearchController < ApplicationController
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
    item_titles = fuzzy_values(Item, :title, query)
    transaction_item_names = fuzzy_values(Transaction, :item_name, query)

    (item_titles + transaction_item_names).uniq.first(5)
  rescue ActiveRecord::StatementInvalid
    []
  end

  def fuzzy_values(model, column_name, query)
    model
      .where.not(column_name => [ nil, "" ])
      .select(column_name)
      .distinct
      .where("#{column_name} % ?", query)
      .order(Arel.sql("similarity(#{column_name}, #{ActiveRecord::Base.connection.quote(query)}) DESC"))
      .limit(5)
      .pluck(column_name)
  end

  def in_memory_suggestions(query)
    source_candidates = (
      Item.where.not(title: [ nil, "" ]).distinct.pluck(:title) +
      Transaction.where.not(item_name: [ nil, "" ]).distinct.pluck(:item_name)
    ).uniq
    return [] if source_candidates.empty?

    normalized = query.downcase
    source_candidates
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
