# frozen_string_literal: true

# Header - Phlex implementation
#
# Header section of the alert dialog.
# Uses AlertDialogHeaderBehavior module for shared styling logic.
#
# @example Basic usage
#   render UI::Header.new do
#     render UI::Title.new { "Alert Title" }
#   end
class UI::AlertDialogHeader < Phlex::HTML
  include UI::AlertDialogHeaderBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**alert_dialog_header_html_attributes) do
      yield if block_given?
    end
  end
end
