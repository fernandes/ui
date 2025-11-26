# frozen_string_literal: true

module UI
  module NavigationMenu
    # Content - Phlex implementation
    #
    # Container for navigation menu content that appears when trigger is activated.
    # Supports animated transitions based on motion direction.
    #
    # @example Basic usage
    #   render UI::NavigationMenu::Content.new do
    #     ul(class: "grid gap-2 md:w-[400px]") do
    #       li do
    #         render UI::NavigationMenu::Link.new(href: "/docs") { "Documentation" }
    #       end
    #     end
    #   end
    class Content < Phlex::HTML
      include UI::NavigationMenu::ContentBehavior

      # @param viewport [Boolean] Whether content should be rendered in viewport (inherited from parent)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(viewport: true, classes: "", **attributes)
        @viewport = viewport
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**navigation_menu_content_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
