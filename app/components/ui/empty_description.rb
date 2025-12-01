# frozen_string_literal: true

# EmptyDescription - Phlex implementation
#
# Displays the description of the empty state.
#
# @example
#   render UI::EmptyDescription.new { "Try adjusting your search criteria." }
class UI::EmptyDescription < Phlex::HTML
  include UI::EmptyDescriptionBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    p(**empty_description_html_attributes.merge(@attributes), &block)
  end
end
