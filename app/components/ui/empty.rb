# frozen_string_literal: true

# Empty - Phlex implementation
#
# Displays empty states in applications with customizable media, titles, descriptions, and actions.
#
# @example Basic usage
#   render UI::Empty.new do
#     render UI::EmptyHeader.new do
#       render UI::EmptyTitle.new { "No results found" }
#       render UI::EmptyDescription.new { "Try adjusting your search criteria." }
#     end
#   end
class UI::Empty < Phlex::HTML
  include UI::EmptyBehavior

  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**empty_html_attributes.merge(@attributes), &block)
  end
end
