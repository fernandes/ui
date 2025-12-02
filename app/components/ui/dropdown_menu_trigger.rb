# frozen_string_literal: true

# Trigger - Phlex implementation
#
# Wrapper that adds toggle action to child element.
# Uses DropdownMenuTriggerBehavior concern for shared styling logic.
#
# Supports asChild pattern for composition without wrapper elements.
#
# @example Basic usage
#   render UI::Trigger.new { button { "Open Menu" } }
#
# @example With asChild - pass attributes to custom button
#   render UI::Trigger.new(as_child: true) do |trigger_attrs|
#     render UI::Button.new(**trigger_attrs) { "Menu" }
#   end
class UI::DropdownMenuTrigger < Phlex::HTML
  include UI::DropdownMenuTriggerBehavior
  include UI::SharedAsChildBehavior

  # @param as_child [Boolean] When true, yields attributes to block instead of rendering wrapper
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, classes: "", **attributes)
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    trigger_attrs = dropdown_menu_trigger_html_attributes.deep_merge(@attributes)

    if @as_child
      # When as_child is true, only pass functional attributes (data, aria, tabindex, role)
      # The child component handles its own styling (following shadcn pattern)
      yield(trigger_attrs.except(:class)) if block_given?
    else
      # Default: render wrapper div with trigger behavior
      div(**trigger_attrs) do
        yield if block_given?
      end
    end
  end
end
