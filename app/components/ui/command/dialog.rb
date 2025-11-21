# frozen_string_literal: true

module UI
  module Command
    class Dialog < Phlex::HTML
      include DialogBehavior

      def initialize(shortcut: "meta+j", classes: "", **attributes)
        @shortcut = shortcut
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**command_dialog_html_attributes.deep_merge(@attributes)) do
          render UI::Dialog::Dialog.new(close_on_escape: true, close_on_overlay_click: true) do
            render UI::Dialog::Overlay.new do
              render UI::Dialog::Content.new(classes: command_dialog_content_classes) do
                render UI::Command::Command.new do
                  yield if block_given?
                end
              end
            end
          end
        end
      end
    end
  end
end
