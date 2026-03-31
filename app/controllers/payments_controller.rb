class PaymentsController < ApplicationController
  def new
    @recent_transactions = Transaction.order(created_at: :desc).limit(5)
  end

  def mock_checkout
    item_name = params[:item_name].to_s.strip
    amount = params[:amount].to_i

    if item_name.blank? || amount <= 0
      redirect_to payments_path, alert: "Invalid checkout input."
      return
    end

    Transaction.create!(
      item_name: item_name,
      amount_cents: amount * 100,
      provider_ref: "mock_#{SecureRandom.hex(8)}"
    )

    redirect_to payments_path, notice: "Mock Stripe payment succeeded for #{item_name} (HK$#{amount})."
  end
end
