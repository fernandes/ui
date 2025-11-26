# frozen_string_literal: true

module UI
  module NavigationMenu
    # NavigationMenu - Phlex implementation
    #
    # A collection of links for navigating websites. Built on Radix UI patterns.
    # Uses NavigationMenuBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::NavigationMenu::NavigationMenu.new do
    #     render UI::NavigationMenu::List.new do
    #       render UI::NavigationMenu::Item.new do
    #         render UI::NavigationMenu::Trigger.new { "Getting Started" }
    #         render UI::NavigationMenu::Content.new do
    #           render UI::NavigationMenu::Link.new(href: "/docs") { "Introduction" }
    #         end
    #       end
    #     end
    #   end
    #
    # @example With viewport disabled
    #   render UI::NavigationMenu::NavigationMenu.new(viewport: false) do
    #     # Content appears directly under trigger instead of in viewport
    #   end
    class NavigationMenu < Phlex::HTML
      include UI::NavigationMenu::NavigationMenuBehavior

      # @param viewport [Boolean] Whether to use viewport for content positioning
      # @param delay_duration [Integer] Delay in ms before opening on hover
      # @param skip_delay_duration [Integer] Delay skip period between items
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(viewport: true, delay_duration: 200, skip_delay_duration: 300, classes: "", **attributes)
        @viewport = viewport
        @delay_duration = delay_duration
        @skip_delay_duration = skip_delay_duration
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        nav(**navigation_menu_html_attributes.deep_merge(@attributes)) do
          yield if block_given?

          # Render viewport if enabled
          if @viewport
            render UI::NavigationMenu::Viewport.new
          end
        end
      end
    end
  end
end
