# frozen_string_literal: true

# Action - Phlex implementation
#
# Primary action button for the alert dialog.
# Wraps the Button component with alert dialog close action.
#
# @example Basic usage
#   render UI::Action.new { "Continue" }
class UI::AlertDialogAction < Phlex::HTML
  include UI::AlertDialogActionBehavior

  # @param variant [String, Symbol] Button variant
  # @param size [String, Symbol] Button size
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(variant: :default, size: :default, classes: "", **attributes)
    @variant = variant
    @size = size
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    render UI::Button.new(
      variant: @variant,
      size: @size,
      classes: @classes,
      **alert_dialog_action_button_data_attributes.merge(@attributes)
    ) do
      yield if block_given?
    end
  end
end
