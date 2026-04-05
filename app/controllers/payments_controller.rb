class PaymentsController < ApplicationController
  def new
    @recent_transactions = Transaction.order(created_at: :desc).limit(5)
  end

  def mock_checkout
    item_name = params[:item_name].to_s.strip
    amount = params[:amount].to_i

    if item_name.blank? || amount <= 0
      respond_to do |format|
        format.html { redirect_to payments_path, alert: "Invalid checkout input." }
        format.json { render json: { error: "Invalid checkout input." }, status: :unprocessable_entity }
      end
      return
    end

    tx = Transaction.create!(
      item_name: item_name,
      amount_cents: amount * 100,
      provider_ref: "mock_#{SecureRandom.hex(8)}"
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
  end
end
