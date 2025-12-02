# frozen_string_literal: true

# ListComponent - ViewComponent implementation
#
# Container for navigation menu items.
class UI::NavigationMenuListComponent < ViewComponent::Base
  include UI::NavigationMenuListBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :ul, **navigation_menu_list_html_attributes.deep_merge(@attributes) do
      content
    end
  end
end
