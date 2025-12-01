# frozen_string_literal: true

# Viewport - Phlex implementation
#
# Scrollable content container with hidden native scrollbar.
#
# @example Basic usage (automatically used by ScrollArea)
#   render UI::Viewport.new do
#     # Content here
#   end
class UI::ScrollAreaViewport < Phlex::HTML
  include UI::ScrollAreaViewportBehavior
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
    viewport_attrs = scroll_area_viewport_html_attributes.deep_merge(@attributes)

    # Add Stimulus target
    viewport_attrs[:data] ||= {}
    viewport_attrs[:data][:"ui--scroll-area-target"] = "viewport"

    if @as_child && block_given?
      # asChild mode: yield attributes to block
      yield(viewport_attrs)
    else
      # Default mode: render as div with inner table div
      div(**viewport_attrs) do
        div(style: "min-width: 100%; display: table;", &block)
      end
    end
  end
end
