class PaymentsController < ApplicationController
  before_action :authenticate_with_token!, only: [ :mock_checkout ]   # require authentication

  def new
    @recent_transactions = Transaction.order(created_at: :desc).limit(5)
  end

  def mock_checkout
    item_name = params[:item_name].to_s.strip
    amount = params[:amount].to_i
    item_id = params[:item_id]   # frontend must send this

    if item_name.blank? || amount <= 0
      respond_to do |format|
        format.html { redirect_to payments_path, alert: "Invalid checkout input." }
        format.json { render json: { error: "Invalid checkout input." }, status: :unprocessable_entity }
      end
      return
    end

    # Determine community_id from the item or fallback to current user's community
    community_id = nil
    if item_id.present?
      item = Item.find_by(id: item_id)
      if item
        community_id = item.community_id
      else
        respond_to do |format|
          format.html { redirect_to payments_path, alert: "Item not found." }
          format.json { render json: { error: "Item not found." }, status: :not_found }
        end
        return
      end
    else
      # Fallback to current user's community (if no item_id provided)
      community_id = @current_user.community_id
    end

    tx = Transaction.create!(
      item_name: item_name,
      amount_cents: amount * 100,
      provider_ref: "mock_#{SecureRandom.hex(8)}",
      community_id: community_id,
      status: "succeeded",
      currency: "HKD",
      provider: "stripe_mock"
    )

    respond_to do |format|
      format.html { redirect_to payments_path, notice: "Mock Stripe payment succeeded for #{item_name} (HK$#{amount})." }
      format.json do
        render json: {
          message: "Mock Stripe payment succeeded for #{item_name} (HK$#{amount}).",
          transaction: {
            id: tx.id,
            item_name: tx.item_name,
            amount_hkd: tx.amount_cents / 100.0,
            provider_ref: tx.provider_ref,
            status: tx.status
          }
        }, status: :created
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    respond_to do |format|
      format.html { redirect_to payments_path, alert: "Payment failed: #{e.message}" }
      format.json { render json: { error: "Payment failed: #{e.message}" }, status: :unprocessable_entity }
    end
  end
end
