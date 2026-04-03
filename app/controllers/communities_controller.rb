# app/controllers/communities_controller.rb
class CommunitiesController < ApplicationController
    # No authentication required (users need this before login)
    # skip_before_action :authenticate_with_token!, only: [:index]

    def index
      communities = Community.all.select(:id, :name, :slug)
      render json: communities
    end
end
