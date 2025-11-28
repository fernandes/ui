# frozen_string_literal: true

    class UI::CommandDialogComponent < ViewComponent::Base
      include UI::CommandDialogBehavior

      def initialize(shortcut: "meta+j", classes: "", **attributes)
        @shortcut = shortcut
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **command_dialog_html_attributes.deep_merge(@attributes) do
          render UI::DialogComponent.new(close_on_escape: true, close_on_overlay_click: true) do
            render UI::DialogOverlayComponent.new do
              render UI::DialogContentComponent.new(classes: command_dialog_content_classes) do
                render UI::CommandComponent.new do
                  content
                end
              end
            end
          end
        end
      end
    end
