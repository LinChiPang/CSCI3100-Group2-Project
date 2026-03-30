module Admin
  class AnalyticsController < ApplicationController
    def index
      @labels = %w[Mon Tue Wed Thu Fri Sat Sun]
      @transactions = [3, 5, 4, 7, 9, 6, 8]
      @listings = [8, 10, 7, 11, 12, 9, 13]
      @total_transactions = @transactions.sum
      @total_listings = @listings.sum
    end
  end
end
