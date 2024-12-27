UI::Engine.routes.draw do
  post "/calendar/:year/:month", to: "calendar#create"
end
