# frozen_string_literal: true

# Description - Phlex implementation
#
# Description text for the alert dialog.
# Uses AlertDialogDescriptionBehavior module for shared styling logic.
#
# @example Basic usage
#   render UI::Description.new { "This action cannot be undone." }
class UI::AlertDialogDescription < Phlex::HTML
  include UI::AlertDialogDescriptionBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    p(**alert_dialog_description_html_attributes) do
      yield if block_given?
    end
  end
end
