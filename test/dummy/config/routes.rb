Rails.application.routes.draw do
  # Route to test importmap (default Rails 8 setup)
  get "/importmap", to: "importmap#index"

  # Route to test bundled JavaScript (jsbundling-rails)
  get "/bundled", to: "bundled#index"

  # Component showcase routes
  get "/components", to: "components#index"
  get "/components/accordion", to: "components#accordion"
  get "/components/alert", to: "components#alert"
  get "/components/alert_dialog", to: "components#alert_dialog"
  get "/components/aspect_ratio", to: "components#aspect_ratio"
  get "/components/avatar", to: "components#avatar"
  get "/components/badge", to: "components#badge"
  get "/components/button", to: "components#button"
  get "/components/dialog", to: "components#dialog"
  get "/components/dropdown_menu", to: "components#dropdown_menu"

  # Mount Hotwire Spark for live reload in development
  mount Hotwire::Spark::Engine => "/spark" if Rails.env.development?
end
