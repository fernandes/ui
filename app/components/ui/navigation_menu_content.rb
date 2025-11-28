# frozen_string_literal: true

    # Content - Phlex implementation
    #
    # Container for navigation menu content that appears when trigger is activated.
    # Supports animated transitions based on motion direction.
    #
    # @example Basic usage
    #   render UI::Content.new do
    #     ul(class: "grid gap-2 md:w-[400px]") do
    #       li do
    #         render UI::Link.new(href: "/docs") { "Documentation" }
    #       end
    #     end
    #   end
    class UI::NavigationMenuContent < Phlex::HTML
      include UI::ContentBehavior

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
