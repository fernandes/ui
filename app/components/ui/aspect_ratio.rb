# frozen_string_literal: true

# AspectRatio - Phlex implementation
#
# Displays content within a desired aspect ratio.
# Uses AspectRatioBehavior module for shared styling logic.
#
# @example Basic usage with 16:9 ratio
#   render UI::AspectRatio.new(ratio: 16.0/9.0) do
#     img src: "image.jpg", class: "h-full w-full object-cover"
#   end
class UI::AspectRatio < Phlex::HTML
  include UI::AspectRatioBehavior

  # @param ratio [Float] The desired aspect ratio (width/height, e.g., 16/9)
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(ratio: 1.0, classes: "", **attributes)
    @ratio = ratio
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**aspect_ratio_html_attributes) do
      div(**aspect_ratio_padding_attributes)
      div(**aspect_ratio_content_attributes) do
        yield if block_given?
      end
    end
  end
end
