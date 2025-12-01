# frozen_string_literal: true

# Select Scroll Up Button - Phlex implementation
#
# Button that appears when content is scrollable upward.
# Automatically hidden when at top of list.
#
# @example Default usage (no customization needed)
#   render UI::ScrollUpButton.new
class UI::SelectScrollUpButton < Phlex::HTML
  include UI::SelectScrollUpButtonBehavior
  include UI::SharedAsChildBehavior

  # @param as_child [Boolean] When true, yields attributes to block instead of rendering div
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(as_child: false, classes: "", **attributes)
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    button_attrs = select_scroll_up_button_html_attributes.deep_merge(@attributes)

    if @as_child && block_given?
      # asChild mode: yield attributes to block
      yield(button_attrs)
    else
      # Default mode: render as div with chevron up icon
      div(**button_attrs) do
        svg(
          class: "size-4",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round"
        ) do |s|
          s.path(d: "m18 15-6-6-6 6")
        end
      end
    end
  end
end
