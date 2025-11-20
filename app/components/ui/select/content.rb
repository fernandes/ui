# frozen_string_literal: true

module UI
  module Select
    # Select Content - Phlex implementation
    #
    # Dropdown container that holds items and groups.
    # Includes scroll buttons and viewport.
    #
    # @example Basic usage
    #   render UI::Select::Content.new do
    #     render UI::Select::Item.new(value: "apple") { "Apple" }
    #     render UI::Select::Item.new(value: "banana") { "Banana" }
    #   end
    class Content < Phlex::HTML
      include UI::SelectContentBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**select_content_html_attributes.deep_merge(@attributes)) do
          # Scroll up button
          render UI::Select::ScrollUpButton.new

          # Viewport with scrollable content
          div(
            data_radix_select_viewport: true,
            data_ui__select_target: "viewport",
            data_action: "scroll->ui--select#handleScroll",
            class: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:ring-ring/50 p-1",
            style: "overflow-y: auto; overflow-x: hidden;"
          ) do
            yield if block_given?
          end

          # Scroll down button
          render UI::Select::ScrollDownButton.new
        end
      end
    end
  end
end
