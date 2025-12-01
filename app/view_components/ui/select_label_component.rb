# frozen_string_literal: true

# LabelComponent - ViewComponent implementation
#
# Label for a group of select items.
#
# @example Basic usage
#   <%= render UI::LabelComponent.new { "North America" } %>
class UI::SelectLabelComponent < ViewComponent::Base
  include UI::SelectLabelBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, content, **select_label_html_attributes.deep_merge(@attributes)
  end
end
