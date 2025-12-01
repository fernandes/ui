# frozen_string_literal: true

# Sheet header component (ViewComponent)
#
# @example
#   <%= render UI::HeaderComponent.new do %>
#     <%= render UI::TitleComponent.new { "Title" } %>
#     <%= render UI::DescriptionComponent.new { "Description" } %>
#   <% end %>
class UI::SheetHeaderComponent < ViewComponent::Base
  include UI::SheetHeaderBehavior

  # @param classes [String] additional CSS classes
  def initialize(classes: "")
    @classes = classes
  end

  def call
    content_tag :div, content, **sheet_header_html_attributes
  end
end
