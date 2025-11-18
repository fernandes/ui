module UI
  class Engine < ::Rails::Engine
    isolate_namespace UI

    initializer "setup_inflections" do
      ActiveSupport::Inflector.inflections do |inflect|
        inflect.acronym "UI"
      end
    end

    # Configure asset paths for different asset pipelines
    initializer "ui.assets" do |app|
      # Add compiled assets path for Propshaft (Rails 8 default)
      if defined?(Propshaft)
        app.config.assets.paths << root.join("app/assets/builds")
        # Add JavaScript path for Propshaft
        app.config.assets.paths << root.join("app/javascript")
      end

      # Add assets paths for Sprockets (Rails 6/7)
      if defined?(Sprockets)
        app.config.assets.paths << root.join("app/assets/stylesheets")
        app.config.assets.paths << root.join("app/assets/javascripts") if root.join("app/assets/javascripts").exist?

        # Precompile engine assets for production
        app.config.assets.precompile += %w[ui/application.css ui/application.js]
      end
    end

    # Register importmap if available (Rails 7+ with importmap-rails)
    initializer "ui.importmap", after: "importmap" do |app|
      # Only proceed if importmap is actually loaded and configured
      next unless defined?(Importmap::Engine)
      next unless app.respond_to?(:importmap)

      # Add engine's importmap configuration to the app's importmap paths
      engine_importmap_path = root.join("config/importmap.rb")
      if engine_importmap_path.exist?
        # Explicitly draw the engine's importmap AFTER initialization
        app.importmap.draw(engine_importmap_path)
      end

      # Add engine's JavaScript path for cache sweeping in development
      engine_js_path = root.join("app/javascript")
      app.config.importmap.cache_sweepers << engine_js_path unless app.config.importmap.cache_sweepers.include?(engine_js_path)
    end

    # Add app/assets/builds to load path for compiled Tailwind CSS
    initializer "ui.asset_paths" do |app|
      config.paths["app/assets"] << "app/assets/builds"
    end
  end
end
