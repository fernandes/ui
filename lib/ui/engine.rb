require_relative "configuration"

module UI
  class Engine < ::Rails::Engine
    isolate_namespace UI

    # ==========================================================================
    # Optional Dependencies
    # ==========================================================================
    # Loading behavior is controlled by UI.configuration:
    #   - nil (default): auto-detect based on gem availability and version
    #   - true: force enable (skip version check, useful for testing)
    #   - false: force disable (don't load even if gem is available)
    #
    # Minimum version requirements (for auto-detect):
    #   - phlex: >= 2.0.0
    #   - view_component: >= 3.0.0

    PHLEX_MIN_VERSION = Gem::Version.new("2.0.0")
    VIEW_COMPONENT_MIN_VERSION = Gem::Version.new("3.0.0")

    # Determine if Phlex should be loaded
    phlex_enabled = case UI.configuration.enable_phlex
    when true
      # Force enable - try to load without version check
      begin
        require "phlex-rails"
        true
      rescue LoadError
        warn "[UI] Phlex force-enabled but gem not found. Phlex components won't be loaded."
        false
      end
    when false
      # Force disable
      false
    else
      # Auto-detect (nil)
      begin
        require "phlex-rails"
        phlex_spec = Gem.loaded_specs["phlex"]
        if phlex_spec && phlex_spec.version >= PHLEX_MIN_VERSION
          true
        else
          version = phlex_spec&.version || "unknown"
          warn "[UI] Phlex #{version} found, but >= #{PHLEX_MIN_VERSION} is required. Phlex components won't be loaded."
          false
        end
      rescue LoadError
        false
      end
    end

    # Determine if ViewComponent should be loaded
    view_component_enabled = case UI.configuration.enable_view_component
    when true
      # Force enable - try to load without version check
      begin
        require "view_component"
        true
      rescue LoadError
        warn "[UI] ViewComponent force-enabled but gem not found. ViewComponents won't be loaded."
        false
      end
    when false
      # Force disable
      false
    else
      # Auto-detect (nil)
      begin
        require "view_component"
        vc_spec = Gem.loaded_specs["view_component"]
        if vc_spec && vc_spec.version >= VIEW_COMPONENT_MIN_VERSION
          true
        else
          version = vc_spec&.version || "unknown"
          warn "[UI] ViewComponent #{version} found, but >= #{VIEW_COMPONENT_MIN_VERSION} is required. ViewComponents won't be loaded."
          false
        end
      rescue LoadError
        false
      end
    end

    # ==========================================================================
    # Autoload Paths Configuration
    # ==========================================================================
    # Behaviors are always loaded (required for ERB partials)
    config.autoload_paths << root.join("app/behaviors")

    # Phlex components
    if phlex_enabled
      config.autoload_paths << root.join("app/components")
    end

    # ViewComponents
    if view_component_enabled
      config.autoload_paths << root.join("app/view_components")
    end

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
