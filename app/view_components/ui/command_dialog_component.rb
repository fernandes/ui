# frozen_string_literal: true

class UI::CommandDialogComponent < ViewComponent::Base
  include UI::CommandDialogBehavior

  def initialize(shortcut: "meta+j", autofocus: true, title: "Command Palette",
    description: "Search for a command to run...", classes: "", **attributes)
    @shortcut = shortcut
    @title = title
    @description = description
    @autofocus = autofocus
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **command_dialog_html_attributes.deep_merge(@attributes) do
      render UI::DialogComponent.new(close_on_escape: true, close_on_overlay_click: true) do
        render UI::DialogOverlayComponent.new do
          render UI::DialogContentComponent.new(classes: command_dialog_content_classes) do
            safe_join([
              render(UI::DialogHeaderComponent.new(classes: command_dialog_header_classes)) do
                safe_join([
                  render(UI::DialogTitleComponent.new.with_content(command_dialog_title)),
                  render(UI::DialogDescriptionComponent.new.with_content(command_dialog_description))
                ])
              end,
              render(UI::CommandComponent.new(autofocus: @autofocus)) { content }
            ])
          end
        end
      end
    end
  end
end
