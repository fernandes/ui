# frozen_string_literal: true

module UI
  module Combobox
    # Wrapper - Phlex implementation
    #
    # Wrapper component that yields combobox attributes to be spread into a container component.
    # Used to wrap Popover/Drawer/DropdownMenu with combobox selection functionality.
    # Uses ComboboxBehavior concern for shared attribute generation logic.
    #
    # The combobox pattern provides:
    # - Selection state management via Stimulus controller
    # - Automatic text update when item is selected
    # - Check icon visibility control (opacity-0/100)
    # - Container closing after selection
    #
    # @example With Popover
    #   render UI::Combobox::Wrapper.new(value: "") do |combobox_attrs|
    #     render UI::Popover::Popover.new(**combobox_attrs, placement: "bottom-start") do
    #       render UI::Popover::Trigger.new(as_child: true) do |trigger_attrs|
    #         render UI::Button::Button.new(**trigger_attrs) do
    #           span(**combobox_text_html_attributes) { "Select framework..." }
    #         end
    #       end
    #
    #       render UI::Popover::Content.new do
    #         render UI::Command::Command.new do
    #           render UI::Command::Item.new(value: "next", **combobox_item_html_attributes("next")) do
    #             span { "Next.js" }
    #             svg(class: "ml-auto h-4 w-4 opacity-0") { path(d: "M20 6 9 17l-5-5") }
    #           end
    #         end
    #       end
    #     end
    #   end
    #
    # @example With Drawer (responsive)
    #   render UI::Combobox::Wrapper.new(value: "done") do |combobox_attrs|
    #     render UI::Drawer::Drawer.new(**combobox_attrs) do
    #       # ... drawer content
    #     end
    #   end
    class Wrapper < Phlex::HTML
      include ComboboxBehavior

      # @param value [String] Initial selected value (empty string for no selection)
      # @param attributes [Hash] Additional HTML attributes to merge
      def initialize(value: "", **attributes)
        @value = value
        @attributes = attributes
      end

      def view_template(&block)
        # Yield combobox attributes to be spread into container component
        # The block receives a hash of data attributes that should be passed
        # to the wrapping container (Popover/Drawer/DropdownMenu)
        yield(combobox_html_attributes.deep_merge(@attributes)) if block_given?
      end
    end
  end
end
