# app/controllers/admin/analytics_controller.rb
module Admin
  class AnalyticsController < ApplicationController
    # Only authenticate for JSON requests; browser HTML requests serve the SPA shell
    before_action :authenticate_with_token!, if: -> { request.format.json? || request.xhr? }
    before_action :require_admin!, if: -> { request.format.json? || request.xhr? }

    def index
      unless request.format.json? || request.xhr?
        render_frontend_spa!
        return
      end

      # Scope to current admin's community
      transactions = Transaction.where(community_id: @current_user.community_id)
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
        total_transactions: total_transactions,
        total_gmv_cents: total_gmv_cents,
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

    private

    def require_admin!
      unless @current_user&.admin?
        render json: { error: "Not authorized" }, status: :forbidden
      end
    end

    def render_frontend_spa!
      # Try to render the actual frontend build if it exists
      if File.exist?(Rails.root.join('public', 'index.html'))
        render file: Rails.root.join('public', 'index.html'), layout: false
      else
        # Return a minimal HTML fallback for testing/development
        render html: "<html><body><h1>Admin Analytics</h1></body></html>".html_safe, status: :ok
      end
    end
  end
end
