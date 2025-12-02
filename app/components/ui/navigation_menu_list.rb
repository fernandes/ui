# frozen_string_literal: true

# List - Phlex implementation
#
# Container for navigation menu items.
#
# @example Basic usage
#   render UI::List.new do
#     render UI::Item.new do
#       render UI::Trigger.new { "Menu" }
#     end
#   end
class UI::NavigationMenuList < Phlex::HTML
  include UI::NavigationMenuListBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    ul(**navigation_menu_list_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
