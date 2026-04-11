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
      provider_ref: "mock_#{SecureRandom.hex(8)}",
      community_id: resolve_checkout_community_id
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

  private

  # Prefer the listing's community when item_id is provided and belongs to the buyer's community;
  # otherwise attribute the mock payment to the authenticated user's community (SPA JSON calls).
  def resolve_checkout_community_id
    user = current_user_from_bearer_if_valid
    return nil unless user

    if params[:item_id].present?
      item = Item.find_by(id: params[:item_id])
      return item.community_id if item && item.community_id == user.community_id
    end

    user.community_id
  end

  def current_user_from_bearer_if_valid
    token = request.headers["Authorization"].to_s.sub(/\ABearer /i, "")
    return nil if token.blank?

    payload = JWT.decode(token, jwt_secret, true, algorithms: [ "HS256" ])
    user_id = payload[0]["sub"]
    user = User.find(user_id)
    return nil unless payload[0]["jti"] == user.jti

    user
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    nil
  end
end
