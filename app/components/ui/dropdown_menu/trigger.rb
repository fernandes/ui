# frozen_string_literal: true

module UI
  module DropdownMenu
    # Trigger - Phlex implementation
    #
    # Wrapper that adds toggle action to child element.
    # Uses DropdownMenuTriggerBehavior concern for shared styling logic.
    #
    # Supports asChild pattern for composition without wrapper elements.
    #
    # @example Basic usage
    #   render UI::DropdownMenu::Trigger.new { button { "Open Menu" } }
    #
    # @example With asChild - pass attributes to custom button
    #   render UI::DropdownMenu::Trigger.new(as_child: true) do |trigger_attrs|
    #     render UI::Button::Button.new(**trigger_attrs) { "Menu" }
    #   end
    class Trigger < Phlex::HTML
      include UI::DropdownMenu::DropdownMenuTriggerBehavior
      include UI::Shared::AsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering wrapper
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        trigger_attrs = dropdown_menu_trigger_html_attributes.deep_merge(@attributes)

        if @as_child
          # Yield attributes to block - child receives trigger behavior
          yield(trigger_attrs) if block_given?
        else
          # Default: render wrapper div with trigger behavior
          div(**trigger_attrs) do
            yield if block_given?
          end
        end
      end
    end
  end
end
