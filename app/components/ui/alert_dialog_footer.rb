# frozen_string_literal: true

# Footer - Phlex implementation
#
# Footer section with action buttons for the alert dialog.
# Uses AlertDialogFooterBehavior module for shared styling logic.
#
# @example Basic usage
#   render UI::Footer.new do
#     render UI::Cancel.new { "Cancel" }
#     render UI::Action.new { "Continue" }
#   end
class UI::AlertDialogFooter < Phlex::HTML
  include UI::AlertDialogFooterBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**alert_dialog_footer_html_attributes) do
      yield if block_given?
    end
  end
end
