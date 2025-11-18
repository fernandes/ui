# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.2.2/dist/stimulus.min.js"

# UI Engine pins are automatically loaded from the engine's config/importmap.rb
# The engine uses "ui" as the import name, matching the convention
