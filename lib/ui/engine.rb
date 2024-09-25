module UI
  class Engine < ::Rails::Engine
    isolate_namespace UI

    initializer 'setup_inflections' do
      ActiveSupport::Inflector.inflections do |inflect|
        inflect.acronym 'UI'
      end
    end

    initializer 'action_controller.set_helpers_path' do
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

    config.to_prepare do
      ::ApplicationHelper.include(UI::ApplicationHelper)
    end
  end
end
