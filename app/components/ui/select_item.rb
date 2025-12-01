# frozen_string_literal: true

# Select Item - Phlex implementation
#
# Individual selectable option in the dropdown.
# Supports asChild pattern for composition.
#
# @example Basic usage
#   render UI::Item.new(value: "apple") { "Apple" }
#
# @example Disabled item
#   render UI::Item.new(value: "angular", disabled: true) { "Angular (Coming Soon)" }
#
# @example With asChild (as link)
#   render UI::Item.new(value: "dashboard", as_child: true) do |attrs|
#     a(href: "#dashboard", **attrs, class: "flex items-center gap-2") do
#       span(class: "flex-1") { "Dashboard" }
#     end
#   end
class UI::SelectItem < Phlex::HTML
  include UI::SelectItemBehavior
  include UI::SharedAsChildBehavior

  # @param as_child [Boolean] When true, yields attributes to block instead of rendering div
  # @param value [String] Value of this option
  # @param disabled [Boolean] Whether the item is disabled
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, value: nil, disabled: false, classes: "", **attributes)
    @as_child = as_child
    @value = value
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    item_attrs = select_item_html_attributes.deep_merge(@attributes)

    if @as_child
      # asChild mode: yield attributes to block
      yield(item_attrs) if block_given?
    else
      # Default mode: render as div
      div(**item_attrs) do
        span(class: "flex-1") do
          yield if block_given?
        end

        # Checkmark icon - hidden by default, shown when selected
        svg(
          data_ui__select_target: "itemCheck",
          class: "ml-auto size-4 opacity-0 transition-opacity",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round"
        ) do |s|
          s.path(d: "M20 6 9 17l-5-5")
        end
      end
    end
  end
end
