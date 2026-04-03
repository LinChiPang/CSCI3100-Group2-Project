# app/controllers/community_rules_controller.rb
class CommunityRulesController < ApplicationController
    before_action :authenticate_with_token!, except: [ :show ]   # show is public
    before_action :set_community_rule
    before_action :authorize_admin!, except: [ :show ]

    def show
      render json: @community_rule
    end

    def update
      if @community_rule.update(community_rule_params)
        render json: @community_rule
      else
        render json: { errors: @community_rule.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_community_rule
      # params[:community_id] is the slug (string)
      community = Community.find_by!(slug: params[:community_id])
      @community_rule = community.community_rule
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Community not found" }, status: :not_found
    end

    def authorize_admin!
      unless @current_user.admin? && @current_user.community == @community_rule.community
        render json: { error: "Not authorized" }, status: :forbidden
      end
    end

    def community_rule_params
      params.require(:community_rule).permit(:max_price, :max_active_listings, :posting_enabled, allowed_categories: [])
    end
end
