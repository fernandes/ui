# frozen_string_literal: true

# Trigger - Phlex implementation
#
# Button or element that triggers the popover.
# Uses PopoverTriggerBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::Trigger.new do
#     button { "Click me" }
#   end
class UI::PopoverTrigger < Phlex::HTML
  include UI::PopoverTriggerBehavior

  # @param as_child [Boolean] If true, adds data attributes to child without wrapper
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, classes: "", **attributes)
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    trigger_attrs = popover_trigger_html_attributes.deep_merge(@attributes)

    if @as_child
      # asChild mode: yield attributes to block
      # The caller is responsible for rendering an element with these attributes
      yield(trigger_attrs) if block_given?
    else
      # Default mode: render as div
      div(**trigger_attrs, &block)
    end
  end
end
