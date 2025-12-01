# frozen_string_literal: true

# Accordion container component (Phlex)
# Wraps collapsible accordion items with Stimulus controller
#
# @example Basic usage
#   render UI::Accordion.new do
#     render UI::Item.new(value: "item-1") do
#       render UI::Trigger.new { "Is it accessible?" }
#       render UI::Content.new { "Yes. It adheres to the WAI-ARIA design pattern." }
#     end
#   end
#
# @example Multiple items open
#   render UI::Accordion.new(type: "multiple") do
#     # Multiple items can be open at once
#   end
class UI::Accordion < Phlex::HTML
  include UI::AccordionBehavior

  # @param type [String] "single" (only one item open at a time) or "multiple" (multiple items can be open)
  # @param collapsible [Boolean] whether the open item can be collapsed in "single" mode
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(type: "single", collapsible: false, classes: "", attributes: {}, **)
    @type = type
    @collapsible = collapsible
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template(&block)
    div(**accordion_html_attributes, &block)
  end
end
