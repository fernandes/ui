Rails.application.config.to_prepare do
  ::ApplicationHelper.include(UI::ApplicationHelper)

  if Object.const_defined?("Hotwire::Spark")
    Hotwire::Spark::FileWatcher.class_eval do
      def process_changed_files(changed_files)
        # just replace engine path with app path for
        # live reload of stimulus controllers
        changed_files.each do |file|
          puts file
          file.sub!(
            UI::Engine.root.join("app/javascript/ui/controllers").to_s,
            ::Rails.root.join("app/javascript/controllers").to_s
          )
          puts file
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
