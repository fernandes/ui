# frozen_string_literal: true

# SubTrigger - Phlex implementation
#
# Menu item that opens a submenu.
#
# @example Basic usage
#   render UI::SubTrigger.new { "Share" }
class UI::MenubarSubTrigger < Phlex::HTML
  include UI::MenubarSubTriggerBehavior

  # @param inset [Boolean] Add left padding to align with checkbox/radio items
  # @param disabled [Boolean] Disable the item
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(inset: false, disabled: false, classes: "", **attributes)
    @inset = inset
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**menubar_sub_trigger_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
      render_chevron_icon
    end
  end

  private

  def render_chevron_icon
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
      class: "ml-auto size-4"
    ) do |svg|
      svg.path(d: "m9 18 6-6-6-6")
    end
  end
end
