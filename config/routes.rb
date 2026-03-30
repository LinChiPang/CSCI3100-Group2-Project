Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
  root "welcome#index"

  get "notifications", to: "notifications#index"
  post "notifications/broadcast", to: "notifications#broadcast"
  get "payments", to: "payments#new"
  post "payments/mock_checkout", to: "payments#mock_checkout"
  get "search", to: "search#index"
  get "search/suggestions", to: "search#suggestions"

  namespace :admin do
    get "analytics", to: "analytics#index"
  end

end
