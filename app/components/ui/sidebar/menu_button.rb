# frozen_string_literal: true

module UI
  module Sidebar
    # MenuButton - Phlex implementation
    #
    # Interactive button within a sidebar menu item.
    # Supports variants, sizes, and active state.
    #
    # @example Basic usage
    #   render UI::Sidebar::MenuButton.new do
    #     render UI::Icon.new(name: "home")
    #     span { "Home" }
    #   end
    #
    # @example As a link with asChild
    #   render UI::Sidebar::MenuButton.new(as_child: true) do |attrs|
    #     a(**attrs, href: "/home") do
    #       render UI::Icon.new(name: "home")
    #       span { "Home" }
    #     end
    #   end
    #
    # @example Active state
    #   render UI::Sidebar::MenuButton.new(active: true) do
    #     render UI::Icon.new(name: "settings")
    #     span { "Settings" }
    #   end
    #
    # @example With tooltip for icon mode
    #   render UI::Tooltip::Provider.new do
    #     render UI::Tooltip::Tooltip.new do
    #       render UI::Tooltip::Trigger.new(as_child: true) do |trigger_attrs|
    #         render UI::Sidebar::MenuButton.new(**trigger_attrs) do
    #           render UI::Icon.new(name: "home")
    #           span { "Home" }
    #         end
    #       end
    #       render UI::Tooltip::Content.new(side: "right") { "Home" }
    #     end
    #   end
    class MenuButton < Phlex::HTML
      include UI::Sidebar::MenuButtonBehavior

      def initialize(variant: :default, size: :default, active: false, as_child: false, classes: "", **attributes)
        @variant = variant.to_sym
        @size = size.to_sym
        @active = active
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        if @as_child
          yield sidebar_menu_button_html_attributes.deep_merge(@attributes)
        else
          all_attributes = sidebar_menu_button_html_attributes

          if @attributes.key?(:class)
            merged_class = TailwindMerge::Merger.new.merge([
              all_attributes[:class],
              @attributes[:class]
            ].compact.join(" "))
            all_attributes = all_attributes.merge(class: merged_class)
          end

          all_attributes = all_attributes.deep_merge(@attributes.except(:class))

          button(**all_attributes, &block)
        end
      end
    end
  end
end
