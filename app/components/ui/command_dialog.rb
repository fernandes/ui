# frozen_string_literal: true

class UI::CommandDialog < Phlex::HTML
  include UI::CommandDialogBehavior

  def initialize(shortcut: "meta+j", classes: "", **attributes)
    @shortcut = shortcut
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**command_dialog_html_attributes.deep_merge(@attributes)) do
      render UI::Dialog.new(close_on_escape: true, close_on_overlay_click: true) do
        render UI::DialogOverlay.new do
          render UI::DialogContent.new(classes: command_dialog_content_classes) do
            render UI::Command.new do
              yield if block_given?
            end
          end
        end
      end
    end
  end
end
