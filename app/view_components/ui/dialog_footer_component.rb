# frozen_string_literal: true

# Dialog footer component (ViewComponent)
# Footer section for the dialog
#
# @example
#   <%= render UI::FooterComponent.new do %>
#     <%= render UI::CloseComponent.new { "Close" } %>
#   <% end %>
class UI::DialogFooterComponent < ViewComponent::Base
  include UI::DialogFooterBehavior

  # @param classes [String] additional CSS classes
  def initialize(classes: "")
    @classes = classes
  end

  def call
    content_tag :div, content, **dialog_footer_html_attributes
  end
end
