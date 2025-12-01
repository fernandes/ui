# frozen_string_literal: true

# FieldGroupComponent - ViewComponent implementation
#
# Layout wrapper that stacks Field components.
# Uses FieldGroupBehavior concern for shared styling logic.
#
# @example Basic usage
#   <%= render UI::FieldGroupComponent.new do %>
#     <%= render UI::FieldComponent.new do %>
#       Field 1
#     <% end %>
#     <%= render UI::FieldComponent.new do %>
#       Field 2
#     <% end %>
#   <% end %>
class UI::FieldGroupComponent < ViewComponent::Base
  include UI::FieldGroupBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **field_group_html_attributes do
      content
    end
  end
end
