class PaymentsController < ApplicationController
  def new; end

  def mock_checkout
    item = payment_params[:item_name].presence || "Unknown item"
    amount = payment_params[:amount].to_i

    if amount <= 0
      redirect_to payments_path, alert: "Amount must be greater than 0."
      return
    end

    redirect_to payments_path, notice: "Mock Stripe payment succeeded for #{item} (HK$#{amount})."
  end

  private

  def payment_params
    params.permit(:item_name, :amount)
  end
end
