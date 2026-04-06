module Admin
  class AnalyticsController < ApplicationController
    def index
      if request.format.html? && !request.xhr?
        render_frontend_spa!
        return
      end

      require_admin!
      return if performed?

      transactions = Transaction.order(created_at: :asc)
      @total_transactions = transactions.count
      @total_gmv_cents = transactions.sum(:amount_cents)

      grouped = transactions.group_by { |tx| tx.created_at.to_date }
      @daily_labels = grouped.keys.map { |d| d.strftime("%Y-%m-%d") }
      @daily_counts = grouped.values.map(&:count)
      @daily_gmv_hkd = grouped.values.map { |rows| rows.sum(&:amount_cents) / 100.0 }

      recent = transactions.last(10).reverse

      respond_to do |format|
        format.html
        format.json do
          render json: {
            total_transactions: @total_transactions,
            total_gmv_hkd: @total_gmv_cents / 100.0,
            daily_labels: @daily_labels,
            daily_counts: @daily_counts,
            daily_gmv_hkd: @daily_gmv_hkd,
            recent_transactions: recent.map do |tx|
              {
                id: tx.id,
                item_name: tx.item_name,
                amount_hkd: tx.amount_cents / 100.0,
                provider_ref: tx.provider_ref,
                status: tx.status,
                created_at: tx.created_at.strftime("%Y-%m-%d %H:%M")
              }
            end
          }
        end
      end
    end
  end
end
