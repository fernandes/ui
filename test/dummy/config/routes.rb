Rails.application.routes.draw do
  mount Ui::Engine => "/ui"

  # Route to test bundled JavaScript (jsbundling-rails)
  get "/bundled", to: "bundled#index"
end
