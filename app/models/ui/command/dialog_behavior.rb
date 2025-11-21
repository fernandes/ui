# frozen_string_literal: true

module UI
  module Command
    module DialogBehavior
      def command_dialog_base_classes
        ""
      end

      def command_dialog_classes
        UI::TailwindMerge.merge([command_dialog_base_classes, @classes].compact.join(" "))
      end

      def command_dialog_html_attributes
        {
          data: {
            controller: "ui--command-dialog",
            ui__command_dialog_shortcut_value: @shortcut,
            action: "keydown.#{shortcut_action}@document->ui--command-dialog#toggle"
          }
        }
      end

      def shortcut_action
        # Convert "meta+j" to Stimulus format "meta+j"
        @shortcut.downcase
      end

      def command_dialog_content_classes
        "overflow-hidden p-0"
      end
    end
  end
end
