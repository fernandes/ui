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
  get "/components/breadcrumb", to: "components#breadcrumb"
  get "/components/button", to: "components#button"
  get "/components/button_group", to: "components#button_group"
  get "/components/card", to: "components#card"
  get "/components/checkbox", to: "components#checkbox"
  get "/components/collapsible", to: "components#collapsible"
  get "/components/command", to: "components#command"
  get "/components/context_menu", to: "components#context_menu"
  get "/components/dialog", to: "components#dialog"
  get "/components/drawer", to: "components#drawer"
  get "/components/dropdown_menu", to: "components#dropdown_menu"
  get "/components/empty", to: "components#empty"
  get "/components/input", to: "components#input"
  get "/components/input_group", to: "components#input_group"
  get "/components/item", to: "components#item"
  get "/components/label", to: "components#label"
  get "/components/popover", to: "components#popover"
  get "/components/radio_button", to: "components#radio_button"
  get "/components/scroll_area", to: "components#scroll_area"
  get "/components/select", to: "components#select"
  get "/components/separator", to: "components#separator"
  get "/components/spinner", to: "components#spinner"
  get "/components/textarea", to: "components#textarea"
  get "/components/toggle", to: "components#toggle"
  get "/components/toggle_group", to: "components#toggle_group"
  get "/components/tooltip", to: "components#tooltip"

  # Mount Hotwire Spark for live reload in development
  mount Hotwire::Spark::Engine => "/spark" if Rails.env.development?
end
