Rails.application.routes.draw do
  # Route to test importmap (default Rails 8 setup)
  get "/importmap", to: "importmap#index"

  # Route to test bundled JavaScript (jsbundling-rails)
  get "/bundled", to: "bundled#index"

  # Component showcase routes
  get "/components/button", to: "components#button"
  get "/components/accordion", to: "components#accordion"
  get "/components/alert_dialog", to: "components#alert_dialog"
  get "/components/dialog", to: "components#dialog"

  # Mount Hotwire Spark for live reload in development
  mount Hotwire::Spark::Engine => "/spark" if Rails.env.development?
end
