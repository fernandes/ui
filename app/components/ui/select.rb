# frozen_string_literal: true

# Select - Phlex implementation
#
# A custom select component with keyboard navigation, scrollable viewport, and form integration.
# Root container that wraps trigger, content, and items.
#
# @example Basic usage
#   render UI::Select.new(value: "apple") do
#     render UI::Trigger.new(placeholder: "Select a fruit...")
#     render UI::Content.new do
#       render UI::Item.new(value: "apple") { "Apple" }
#       render UI::Item.new(value: "banana") { "Banana" }
#     end
#   end
#
# @example With groups
#   render UI::Select.new do
#     render UI::Trigger.new(placeholder: "Select timezone...")
#     render UI::Content.new do
#       render UI::Group.new do
#         render UI::Label.new { "North America" }
#         render UI::Item.new(value: "america/new_york") { "Eastern Time" }
#       end
#     end
#   end
class UI::Select < Phlex::HTML
  include UI::SelectBehavior

  # @param value [String] Currently selected value
  # @param classes [String] Additional CSS classes to merge
  # @param as_child [Boolean] If true, renders without wrapper div but preserves controller on inner element
  # @param attributes [Hash] Additional HTML attributes
  def initialize(value: nil, classes: "", as_child: false, **attributes)
    @value = value
    @classes = classes
    @as_child = as_child
    @attributes = attributes
  end

  def view_template(&block)
    select_attrs = select_html_attributes.deep_merge(@attributes)

    if @as_child
      # When as_child, we still need a wrapper for the Stimulus controller
      # but we use a minimal inline wrapper that doesn't break flex layouts
      # Override class to use 'contents' which makes the element invisible to layout
      select_attrs[:class] = "contents"
      span(**select_attrs, &block)
    else
      div(**select_attrs, &block)
    end
  end
end
