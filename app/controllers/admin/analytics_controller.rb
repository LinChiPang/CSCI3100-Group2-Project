module Admin
  class AnalyticsController < ApplicationController
    def index
      @transactions = Transaction.order(created_at: :asc)
      @total_transactions = @transactions.count
      @total_gmv_cents = @transactions.sum(:amount_cents)

      grouped = @transactions.group_by { |tx| tx.created_at.to_date }
      @daily_labels = grouped.keys.map { |d| d.strftime("%Y-%m-%d") }
      @daily_counts = grouped.values.map(&:count)
      @daily_gmv_hkd = grouped.values.map { |rows| rows.sum(&:amount_cents) / 100.0 }
    end
  end
end
