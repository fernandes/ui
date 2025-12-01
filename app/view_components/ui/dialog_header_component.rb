# frozen_string_literal: true

# Dialog header component (ViewComponent)
# Header section for the dialog
#
# @example
#   <%= render UI::HeaderComponent.new do %>
#     <%= render UI::TitleComponent.new { "Title" } %>
#     <%= render UI::DescriptionComponent.new { "Description" } %>
#   <% end %>
class UI::DialogHeaderComponent < ViewComponent::Base
  include UI::DialogHeaderBehavior

  # @param classes [String] additional CSS classes
  def initialize(classes: "")
    @classes = classes
  end

  def call
    content_tag :div, content, **dialog_header_html_attributes
  end
end
