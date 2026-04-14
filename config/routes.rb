Rails.application.routes.draw do
  spa_request = lambda { |request| request.get? && request.format.html? && !request.xhr? }

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  get "payments", to: "payments#new"
  post "payments/mock_checkout", to: "payments#mock_checkout"
  get "search", to: "search#index"
  get "search/suggestions", to: "search#suggestions"
  get "notifications", to: "notifications#index"
  post "notifications/broadcast", to: "notifications#broadcast"

  namespace :admin do
    get "analytics", to: "analytics#index"
  end

  # API routes
  devise_for :users, controllers: {
    sessions: "sessions",
    registrations: "registrations"
  }, path_names: {
    sign_in: "login",
    sign_out: "logout"
  }

  resources :items do
    member do
      patch :reserve
      patch :sell
    end
  end

  # config/routes.rb
  resources :communities, only: [ :index ] do
    resource :community_rule, only: [ :show, :update ], controller: "community_rules"
  end

  root "frontend#show", constraints: spa_request
  get "login", to: "frontend#show", constraints: spa_request
  get "register", to: "frontend#show", constraints: spa_request
  get "c/*path", to: "frontend#show", constraints: spa_request
end
