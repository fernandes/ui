# frozen_string_literal: true

# Viewport - Phlex implementation
#
# Container for navigation menu content when viewport mode is enabled.
# Provides consistent positioning and animated sizing.
#
# @example Usage (automatically included in NavigationMenu when viewport: true)
#   render UI::Viewport.new
class UI::NavigationMenuViewport < Phlex::HTML
  include UI::ViewportBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template
    div(**navigation_menu_viewport_wrapper_html_attributes) do
      div(**navigation_menu_viewport_html_attributes.deep_merge(@attributes))
    end
  end
end
