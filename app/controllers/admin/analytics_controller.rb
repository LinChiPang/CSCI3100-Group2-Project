module Admin
  class AnalyticsController < ApplicationController
    def index
      # Browser navigations get the SPA shell; API calls (Accept: application/json) get JSON
      unless request.format.json? || request.xhr?
        render_frontend_spa!
        return
      end

      require_admin!
      return if performed?

      transactions = Transaction
        .where(community_id: @current_user.community_id)
        .order(created_at: :asc)
      total_transactions = transactions.count
      total_gmv_cents = transactions.sum(:amount_cents)

      grouped = transactions.group_by { |tx| tx.created_at.to_date }
      sorted_dates = grouped.keys.sort
      daily_labels = sorted_dates.map { |d| d.strftime("%Y-%m-%d") }
      daily_counts = sorted_dates.map { |d| grouped[d].length }
      daily_gmv_hkd = sorted_dates.map { |d| grouped[d].sum(&:amount_cents) / 100.0 }

      recent = transactions.last(10).reverse

      render json: {
        community_slug: @current_user.community.slug,
        community_name: @current_user.community.name,
        total_transactions: total_transactions,
        total_gmv_hkd: total_gmv_cents / 100.0,
        daily_labels: daily_labels,
        daily_counts: daily_counts,
        daily_gmv_hkd: daily_gmv_hkd,
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
