# frozen_string_literal: true

    # CheckboxItem - Phlex implementation
    #
    # A menu item with checkbox functionality.
    #
    # @example Basic usage
    #   render UI::CheckboxItem.new(checked: true) { "Show Toolbar" }
    class UI::MenubarCheckboxItem < Phlex::HTML
      include UI::MenubarCheckboxItemBehavior

      # @param checked [Boolean] Initial checked state
      # @param disabled [Boolean] Disable the item
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(checked: false, disabled: false, classes: "", **attributes)
        @checked = checked
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**menubar_checkbox_item_html_attributes.deep_merge(@attributes)) do
          # Check indicator container
          span(class: "absolute left-2 flex size-3.5 items-center justify-center") do
            if @checked
              render_check_icon
            end
          end
          yield if block_given?
        end
      end

      private

      def render_check_icon
        svg(
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round",
          class: "size-4",
          data: { state: "checked" }
        ) do |svg|
          svg.path(d: "M20 6 9 17l-5-5")
        end
      end
    end
