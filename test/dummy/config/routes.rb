Rails.application.routes.draw do
  # Route to test importmap (default Rails 8 setup)
  get "/importmap", to: "importmap#index"

  # Route to test bundled JavaScript (jsbundling-rails)
  get "/bundled", to: "bundled#index"

  # Mount Hotwire Spark for live reload in development
  mount Hotwire::Spark::Engine => "/spark" if Rails.env.development?
end
