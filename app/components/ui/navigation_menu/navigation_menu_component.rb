# frozen_string_literal: true

module UI
  module NavigationMenu
    # NavigationMenuComponent - ViewComponent implementation
    #
    # A collection of links for navigating websites. Built on Radix UI patterns.
    #
    # @example Basic usage
    #   <%= render UI::NavigationMenu::NavigationMenuComponent.new do %>
    #     <%= render UI::NavigationMenu::ListComponent.new do %>
    #       <%= render UI::NavigationMenu::ItemComponent.new do %>
    #         <%= render UI::NavigationMenu::TriggerComponent.new do %>Getting Started<% end %>
    #         <%= render UI::NavigationMenu::ContentComponent.new do %>
    #           <%= render UI::NavigationMenu::LinkComponent.new(href: "/docs") do %>Introduction<% end %>
    #         <% end %>
    #       <% end %>
    #     <% end %>
    #   <% end %>
    class NavigationMenuComponent < ViewComponent::Base
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

      def call
        content_tag :nav, **navigation_menu_html_attributes.deep_merge(@attributes) do
          safe_join([
            content,
            (@viewport ? render(UI::NavigationMenu::ViewportComponent.new) : nil)
          ].compact)
        end
      end
    end
  end
end
