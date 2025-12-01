# frozen_string_literal: true

# CheckboxItem - Phlex implementation
#
# Menu item with checkbox state that can be toggled.
# Uses DropdownMenuCheckboxItemBehavior concern for shared styling logic.
#
# @example Basic checkbox item
#   render UI::CheckboxItem.new(checked: true) { "Show Status Bar" }
class UI::DropdownMenuCheckboxItem < Phlex::HTML
  include UI::DropdownMenuCheckboxItemBehavior

  # @param checked [Boolean] Whether checkbox is checked
  # @param disabled [Boolean] Whether item is disabled
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(checked: false, disabled: false, classes: "", **attributes)
    @checked = checked
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**dropdown_menu_checkbox_item_html_attributes.deep_merge(@attributes)) do
      render_checkbox_indicator
      yield if block_given?
    end
  end

  private

  def render_checkbox_indicator
    span(class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center") do
      if @checked
        span(data: {state: "checked"}) do
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "lucide lucide-check size-4"
          ) do |s|
            s.path(d: "M20 6 9 17l-5-5")
          end
        end
      end
    end
  end
end
