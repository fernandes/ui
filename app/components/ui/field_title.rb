# frozen_string_literal: true

# Title - Phlex implementation
#
# Title with label styling inside FieldContent.
# Uses FieldTitleBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::Title.new { "Section Title" }
class UI::FieldTitle < Phlex::HTML
  include UI::FieldTitleBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**field_title_html_attributes) do
      yield if block_given?
    end
  end
end
