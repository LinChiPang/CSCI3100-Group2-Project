class ItemsController < ApplicationController
  before_action :authenticate_with_token!, except: [:index, :show]
  before_action :set_item, only: [:show, :update, :destroy, :reserve, :sell]

  def index
    items = Item.all
    items = apply_filters(items)
    render json: items, each_serializer: ItemSerializer, status: :ok
  end

  def show
    render json: @item, status: :ok
  end

  def create
    @item = @current_user.items.build(item_params)
    if @item.save
      render json: @item, status: :created
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @item.user == @current_user
      if @item.update(item_params)
        render json: @item, status: :ok
      else
        render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end

  def destroy
    if @item.user == @current_user
      @item.destroy
      head :no_content
    else
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end

  def reserve
    if @item.user != @current_user && @item.available?
      if @item.reserve!
        render json: @item, status: :ok
      else
        render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Cannot reserve this item' }, status: :forbidden
    end
  end

  def sell
    if @item.user == @current_user && @item.reserved?
      if @item.sell!
        render json: @item, status: :ok
      else
        render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Cannot sell this item' }, status: :forbidden
    end
  end

  private

  def set_item
    @item = Item.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:title, :description, :price, :community_id, :status)
  end

  def apply_filters(items)
    items = items.where(community_id: params[:community_id]) if params[:community_id].present?
    items = items.where(status: params[:status]) if params[:status].present?
    items = items.where('price >= ?', params[:min_price]) if params[:min_price].present?
    items = items.where('price <= ?', params[:max_price]) if params[:max_price].present?
    if params[:q].present?
      items = items.where('title ILIKE ? OR description ILIKE ?', "%#{params[:q]}%", "%#{params[:q]}%")
    end
    items
  end
end