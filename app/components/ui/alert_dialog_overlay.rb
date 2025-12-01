# frozen_string_literal: true

# Overlay - Phlex implementation
#
# Container wrapper with backdrop and content for the alert dialog overlay.
# Uses AlertDialogOverlayBehavior module for shared styling logic.
#
# @example Basic usage
#   render UI::Overlay.new do
#     render UI::Content.new { "Content here" }
#   end
class UI::AlertDialogOverlay < Phlex::HTML
  include UI::AlertDialogOverlayBehavior

  # @param open [Boolean] Whether the overlay is initially visible
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(open: false, classes: "", **attributes)
    @open = open
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**alert_dialog_overlay_container_html_attributes) do
      div(**alert_dialog_overlay_html_attributes) {}
      yield if block_given?
    end
  end
end
