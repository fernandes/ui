# frozen_string_literal: true

# CheckboxItem - Phlex implementation
#
# A menu item with checkbox functionality.
# Uses ContextMenuCheckboxItemBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::CheckboxItem.new(checked: true) { "Show Status Bar" }
class UI::ContextMenuCheckboxItem < Phlex::HTML
  include UI::ContextMenuCheckboxItemBehavior

  # @param checked [Boolean] Whether the checkbox is checked
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(checked: false, classes: "", **attributes)
    @checked = checked
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**context_menu_checkbox_item_html_attributes.deep_merge(@attributes)) do
      span(class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center") do
        if @checked
          render_check_icon
        end
      end
      yield if block_given?
    end
  end

  private

  def render_check_icon
    svg(
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewbox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      stroke_width: "2",
      stroke_linecap: "round",
      stroke_linejoin: "round",
      class: "size-4"
    ) do |s|
      s.path(d: "M20 6 9 17l-5-5")
    end
  end
end
