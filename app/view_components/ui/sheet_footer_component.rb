# frozen_string_literal: true

# Sheet footer component (ViewComponent)
#
# @example
#   <%= render UI::FooterComponent.new do %>
#     <%= render UI::CloseComponent.new { "Cancel" } %>
#     <%= render UI::ButtonComponent.new { "Save" } %>
#   <% end %>
class UI::SheetFooterComponent < ViewComponent::Base
  include UI::SheetFooterBehavior

  # @param classes [String] additional CSS classes
  def initialize(classes: "")
    @classes = classes
  end

  def call
    content_tag :div, content, **sheet_footer_html_attributes
  end
end
