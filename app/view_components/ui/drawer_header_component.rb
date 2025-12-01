# frozen_string_literal: true

# Drawer header component (ViewComponent)
# Header section for drawer
#
# @example
#   <%= render UI::HeaderComponent.new do %>
#     <%= render UI::TitleComponent.new { "Title" } %>
#     <%= render UI::DescriptionComponent.new { "Description" } %>
#   <% end %>
class UI::DrawerHeaderComponent < ViewComponent::Base
  include UI::DrawerHeaderBehavior

  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(classes: "", attributes: {})
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, content, **drawer_header_html_attributes.merge(@attributes)
  end
end
