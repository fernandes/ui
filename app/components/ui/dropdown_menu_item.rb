# frozen_string_literal: true

    # Item - Phlex implementation
    #
    # Individual menu item that can be rendered as a link or div.
    # Uses DropdownMenuItemBehavior concern for shared styling logic.
    #
    # @example Basic menu item
    #   render UI::Item.new { "Profile" }
    #
    # @example Menu item with link
    #   render UI::Item.new(href: "/profile") { "Profile" }
    class UI::DropdownMenuItem < Phlex::HTML
      include UI::DropdownMenuItemBehavior

      # @param href [String] Optional URL to make item a link
      # @param inset [Boolean] Whether to add left padding for alignment
      # @param variant [String] Variant style (default, destructive)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(href: nil, inset: false, variant: "default", classes: "", **attributes)
        @href = href
        @inset = inset
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        if @href
          a(**dropdown_menu_item_html_attributes.deep_merge(@attributes)) do
            yield if block_given?
          end
        else
          div(**dropdown_menu_item_html_attributes.deep_merge(@attributes)) do
            yield if block_given?
          end
        end
      end
    end
