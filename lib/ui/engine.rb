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
      puts path = File.expand_path("../../../test/components/previews", __FILE__)
      ::Rails.application.config.lookbook.preview_paths << path
      # end
    end

    config.to_prepare do
      ::ApplicationHelper.include(UI::ApplicationHelper)
    end
  end
end
