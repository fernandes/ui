Rails.application.routes.draw do
  mount Ui::Engine => "/ui"

  # Route to test bundled JavaScript (jsbundling-rails)
  get "/bundled", to: "bundled#index"

  # Mount Hotwire Spark for live reload in development
  mount Hotwire::Spark::Engine => "/spark" if Rails.env.development?
end
