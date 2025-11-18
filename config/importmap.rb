# UI Engine - Importmap Configuration
# This file is automatically loaded by Rails apps that use this engine with importmap-rails

# Main entry point
pin "ui", to: "ui/index.js"

# Internal dependencies
pin "ui/common", to: "ui/common.js"
pin "ui/application", to: "ui/application.js"

# Controllers (automatically discover all controllers)
pin_all_from File.expand_path("../app/javascript/ui/controllers", __dir__),
             under: "ui/controllers",
             to: "ui/controllers"
