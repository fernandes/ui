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
        # Add generated JavaScript files from Rollup build (MUST come before source)
        app.config.assets.paths << root.join("app/assets/javascripts")
        app.config.assets.paths << root.join("app/assets/builds")
        # NOTE: We don't add app/javascript to avoid serving source files
        # Source files are only for building, not for serving
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
      # Only watch the generated files, not the source files
      engine_js_generated_path = root.join("app/assets/javascripts")
      app.config.importmap.cache_sweepers << engine_js_generated_path unless app.config.importmap.cache_sweepers.include?(engine_js_generated_path)
    end

    # Add app/assets/builds to load path for compiled Tailwind CSS
    initializer "ui.asset_paths" do |app|
      config.paths["app/assets"] << "app/assets/builds"
    end

    # Include engine helpers in the host application
    initializer "ui.helpers" do
      ActiveSupport.on_load(:action_view) do
        include LucideRails::LucideHelper if defined?(LucideRails::LucideHelper)
      end
    end
  end
end
