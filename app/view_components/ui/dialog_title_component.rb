# frozen_string_literal: true

# Dialog title component (ViewComponent)
# Title heading for the dialog; the controller points the content's
# aria-labelledby at it.
#
# @example
#   <%= render UI::TitleComponent.new { "Dialog Title" } %>
class UI::DialogTitleComponent < ViewComponent::Base
  include UI::DialogTitleBehavior

  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes (an `id` is kept)
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :h2, content, **dialog_title_html_attributes
  end
end
