# frozen_string_literal: true

# Accordion Content component (Phlex)
# Collapsible content area within an accordion item
#
# @example Basic usage
#   render UI::Content.new(item_value: "item-1") do
#     "This is the accordion content"
#   end
class UI::AccordionContent < Phlex::HTML
  include UI::AccordionContentBehavior

  # @param item_value [String] value from parent Item
  # @param initial_open [Boolean] initial state from parent Item
  # @param disabled [Boolean] disabled state from parent Item (the controller also copies it from the item)
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(item_value: nil, initial_open: false, disabled: false, classes: "", attributes: {}, **)
    @item_value = item_value
    @initial_open = initial_open
    @disabled = disabled
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template(&block)
    div(**content_html_attributes) do
      div(class: "pt-0 pb-4", &block)
    end
  end
end
