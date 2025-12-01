# frozen_string_literal: true

# ContentComponent - ViewComponent implementation
#
# Dropdown container that holds items and groups.
# Includes scroll buttons and viewport.
#
# @example Basic usage
#   <%= render UI::ContentComponent.new do %>
#     <%= render UI::ItemComponent.new(value: "apple") { "Apple" } %>
#     <%= render UI::ItemComponent.new(value: "banana") { "Banana" } %>
#   <% end %>
class UI::SelectContentComponent < ViewComponent::Base
  include UI::SelectContentBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **select_content_html_attributes.deep_merge(@attributes) do
      safe_join([
        render(UI::SelectScrollUpButtonComponent.new),
        content_tag(:div,
          content,
          data: {
            radix_select_viewport: true,
            ui__select_target: "viewport",
            action: "scroll->ui--select#handleScroll"
          },
          class: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 focus-visible:ring-ring/50 p-1",
          style: "overflow-y: auto; overflow-x: hidden;"),
        render(UI::SelectScrollDownButtonComponent.new)
      ])
    end
  end
end
