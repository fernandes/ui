# frozen_string_literal: true

# Dialog description component (ViewComponent)
# Description text for the dialog; the controller points the content's
# aria-describedby at it.
#
# @example
#   <%= render UI::DescriptionComponent.new { "Dialog description" } %>
class UI::DialogDescriptionComponent < ViewComponent::Base
  include UI::DialogDescriptionBehavior

  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes (an `id` is kept)
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :p, content, **dialog_description_html_attributes
  end
end
