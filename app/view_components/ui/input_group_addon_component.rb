# frozen_string_literal: true

# InputGroupAddonComponent - ViewComponent implementation
#
# An addon element for input groups that can contain text, icons, or other elements.
# Uses InputGroupAddonBehavior concern for shared styling logic.
#
# @example Text addon
#   <%= render UI::InputGroupAddonComponent.new(align: "inline-start") do %>
#     @
#   <% end %>
#
# @example Button addon
#   <%= render UI::InputGroupAddonComponent.new(align: "inline-end") do %>
#     <%= render UI::InputGroupButtonComponent.new do %>
#       Submit
#     <% end %>
#   <% end %>
class UI::InputGroupAddonComponent < ViewComponent::Base
  include UI::InputGroupAddonBehavior

  # @param align [String] Alignment position: "inline-start", "inline-end", "block-start", "block-end"
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(align: "inline-start", classes: "", **attributes)
    @align = align
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **input_group_addon_html_attributes do
      content
    end
  end
end
