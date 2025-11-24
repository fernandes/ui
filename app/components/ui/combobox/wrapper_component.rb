# frozen_string_literal: true

module UI
  module Combobox
    # WrapperComponent - ViewComponent implementation
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
    #   <%= render UI::Combobox::WrapperComponent.new(value: "") do |combobox_attrs| %>
    #     <%= render UI::Popover::PopoverComponent.new(**combobox_attrs, placement: "bottom-start") do %>
    #       <%= render UI::Popover::TriggerComponent.new(as_child: true) do %>
    #         <%= render UI::Button::ButtonComponent.new do %>
    #           <span data-ui--combobox-target="text">Select framework...</span>
    #         <% end %>
    #       <% end %>
    #
    #       <%= render UI::Popover::ContentComponent.new do %>
    #         <%= render UI::Command::CommandComponent.new do %>
    #           <%= render UI::Command::ItemComponent.new(
    #             value: "next",
    #             data: { ui__combobox_target: "item" }
    #           ) do %>
    #             <span>Next.js</span>
    #             <svg class="ml-auto h-4 w-4 opacity-0">
    #               <path d="M20 6 9 17l-5-5"/>
    #             </svg>
    #           <% end %>
    #         <% end %>
    #       <% end %>
    #     <% end %>
    #   <% end %>
    #
    # @example With Drawer (responsive)
    #   <%= render UI::Combobox::WrapperComponent.new(value: "done") do |combobox_attrs| %>
    #     <%= render UI::Drawer::DrawerComponent.new(**combobox_attrs) do %>
    #       ...
    #     <% end %>
    #   <% end %>
    class WrapperComponent < ViewComponent::Base
      include ComboboxBehavior

      # @param value [String] Initial selected value (empty string for no selection)
      # @param attributes [Hash] Additional HTML attributes to merge
      def initialize(value: "", **attributes)
        @value = value
        @attributes = attributes
        @combobox_html_attrs = combobox_html_attributes.deep_merge(@attributes)
      end
    end
  end
end
