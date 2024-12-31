module UI
  if const_defined?(:Importmap)
    mattr_accessor :importmap, default: Importmap::Map.new
  end

  class Engine < ::Rails::Engine
    isolate_namespace UI

    initializer "setup_inflections" do
      ActiveSupport::Inflector.inflections do |inflect|
        inflect.acronym "UI"
      end
    end

    initializer "ui.lookbook" do
      if defined?(Lookbook)
        # config.after_initialize do
        path = File.expand_path("../../../test/components/previews", __FILE__)
        ::Rails.application.config.lookbook.preview_paths << path

        models_path = File.expand_path("../../../app/models/ui", __FILE__)
        js_path = File.expand_path("../../../app/assets/javascripts", __FILE__)
        ::Rails.application.config.lookbook.listen_paths << models_path
        ::Rails.application.config.lookbook.listen_paths << js_path
        # end

        ::Rails.application.config.lookbook.preview_layout = "ui/component"
      end
    end

    config.to_prepare do
      ::ApplicationHelper.include(UI::ApplicationHelper)

      if Object.const_defined?("Hotwire::Spark")
        Hotwire::Spark::FileWatcher.class_eval do
          def process_changed_files(changed_files)
            # just replace engine path with app path for
            # live reload of stimulus controllers
            changed_files.each do |file|
              file.sub!(
                UI::Engine.root.join("app/javascript/ui/controllers").to_s,
                ::Rails.root.join("app/javascript/controllers/").to_s
              )
            end

            # code from original class
            changed_files.each do |file|
              @callbacks_by_path.each do |path, callbacks|
                if file.to_s.start_with?(path.to_s)
                  callbacks.each { |callback| callback.call(as_relative_path(file)) }
                end
              end
            end
          end
        end
      end
    end

    initializer "ui.importmap", before: "importmap" do |app|
      if Object.const_defined?("Hotwire::Spark")
        app.config.hotwire.spark.stimulus_paths << Engine.root.join("app/javascript/ui/controllers").to_s
        app.config.hotwire.spark.logging = true
      end

      if Object.const_defined?(:Importmap)
        app.config.importmap.paths << Engine.root.join("config/importmap.rb")
        app.config.importmap.cache_sweepers << Engine.root.join("app/javascript/ui/controllers")
        UI.importmap.draw root.join("config/importmap.rb")
        UI.importmap.cache_sweeper watches: root.join("app/javascript/ui/controllers")

        ActiveSupport.on_load(:action_controller_base) do
          before_action { UI.importmap.cache_sweeper.execute_if_updated }
        end
      end
    end

    initializer "ui.assets" do |app|
      app.config.assets.paths << root.join("app/javascript/ui/controllers")
      app.config.assets.paths << root.join("app/stylesheets")
    end
  end
end
