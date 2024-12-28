UI::Engine.routes.draw do
  post "/calendar/format", to: "calendar#format"
  post "/calendar/:year/:month", to: "calendar#create"
end
