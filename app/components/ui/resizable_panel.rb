# frozen_string_literal: true

# ResizablePanel component (Phlex)
# Individual resizable panel within a panel group
#
# @example Basic usage
#   render UI::Panel.new(default_size: 50) do
#     "Panel content"
#   end
#
# @example With constraints
#   render UI::Panel.new(default_size: 50, min_size: 20, max_size: 80) do
#     "Constrained panel"
#   end
class UI::ResizablePanel < Phlex::HTML
  include UI::ResizablePanelBehavior

  # @param default_size [Integer, Float] initial size as percentage (0-100)
  # @param min_size [Integer, Float, nil] minimum size as percentage
  # @param max_size [Integer, Float, nil] maximum size as percentage
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(default_size: nil, min_size: nil, max_size: nil, classes: "", attributes: {}, **)
    @default_size = default_size
    @min_size = min_size
    @max_size = max_size
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template(&block)
    div(**panel_html_attributes, &block)
  end
end
