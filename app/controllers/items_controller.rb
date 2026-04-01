class ItemsController < ApplicationController
  before_action :authenticate_with_token!
  before_action :set_item, only: [ :show, :update, :destroy, :reserve, :sell ]
  before_action :verify_community, only: [ :show, :update, :destroy, :reserve, :sell ]

  def index
    items = @current_user.community.items.includes(:user, :community)
    items = apply_filters(items)
    render json: items, each_serializer: ItemSerializer, status: :ok
  end

  def show
    return unless authorize_item!(:show)

    render json: @item, status: :ok
  end

  def create
    @item = @current_user.items.build(item_params.except(:community_id))
    @item.community = @current_user.community
    return unless authorize_item!(:create, @item)

    if @item.save
      render json: @item, status: :created
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    return unless authorize_item!(:update)

    if @item.update(item_params)
      render json: @item, status: :ok
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    return unless authorize_item!(:destroy)

    @item.destroy
    head :no_content
  end

  def reserve
    return unless authorize_item!(:reserve)

    @item.reserve!(actor: @current_user)
    render json: @item, status: :ok
  rescue ActiveRecord::RecordInvalid
    render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
  end

  def sell
    return unless authorize_item!(:sell)

    @item.sell!(actor: @current_user)
    render json: @item, status: :ok
  rescue ActiveRecord::RecordInvalid
    render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def set_item
    @item = Item.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Item not found" }, status: :not_found
  end

  def verify_community
    # Users can only access items that belong to their own community
    return if @item.community == @current_user.community

    render json: { error: "Item not found" }, status: :not_found
  end

  def authorize_item!(action, record = @item)
    policy = ItemPolicy.new(@current_user, record)
    return true if policy.public_send("#{action}?")

    if action == :show
      render json: { error: "Item not found" }, status: :not_found
    else
      render json: { error: "Not authorized" }, status: :forbidden
    end
    false
  end

  def item_params
    params.require(:item).permit(:title, :description, :price, :status)
  end

  def apply_filters(items)
    items = items.where(status: params[:status]) if params[:status].present?
    items = items.where("price >= ?", params[:min_price]) if params[:min_price].present?
    items = items.where("price <= ?", params[:max_price]) if params[:max_price].present?
    if params[:q].present?
      items = items.where("title ILIKE ? OR description ILIKE ?", "%#{params[:q]}%", "%#{params[:q]}%")
    end
    items
  end
end
