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
  # @param attributes [Hash] Additional HTML attributes
  def initialize(value: nil, classes: "", **attributes)
    @value = value
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**select_html_attributes.deep_merge(@attributes), &block)
  end
end
