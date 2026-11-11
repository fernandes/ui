# frozen_string_literal: true

# Trigger - Phlex implementation
#
# A wrapper that adds the alert dialog open action to its child element.
# Uses AlertDialogTriggerBehavior module for shared styling logic.
#
# @example Basic usage
#   render UI::Trigger.new do
#     render UI::Button.new { "Open Alert Dialog" }
#   end
#
# @example as_child: the button itself is the trigger
#   render UI::AlertDialogTrigger.new(as_child: true) do |attrs|
#     render UI::Button.new(**attrs) { "Delete" }
#   end
class UI::AlertDialogTrigger < Phlex::HTML
  include UI::AlertDialogTriggerBehavior

  # @param as_child [Boolean] When true, yields the trigger attributes to the
  #   block (put them on your own button/link) instead of rendering a wrapper
  # @param classes [String] Additional CSS classes to merge (wrapper only)
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, classes: "", **attributes)
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    if @as_child
      yield(alert_dialog_trigger_as_child_attributes) if block_given?
    else
      div(**alert_dialog_trigger_html_attributes) do
        yield if block_given?
      end
    end
  end
end
