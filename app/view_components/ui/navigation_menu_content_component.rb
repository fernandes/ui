# frozen_string_literal: true

# ContentComponent - ViewComponent implementation
#
# Container for navigation menu content that appears when trigger is activated.
class UI::NavigationMenuContentComponent < ViewComponent::Base
  include UI::NavigationMenuContentBehavior

  # @param viewport [Boolean] Whether content should be rendered in viewport
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(viewport: true, classes: "", **attributes)
    @viewport = viewport
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **navigation_menu_content_html_attributes.deep_merge(@attributes) do
      content
    end
  end
end
