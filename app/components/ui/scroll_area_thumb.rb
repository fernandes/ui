# frozen_string_literal: true

# Thumb - Phlex implementation
#
# Draggable scroll indicator inside the scrollbar.
#
# @example Default usage (automatically used by Scrollbar)
#   render UI::Thumb.new
class UI::ScrollAreaThumb < Phlex::HTML
  include UI::ScrollAreaThumbBehavior
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
    thumb_attrs = scroll_area_thumb_html_attributes.deep_merge(@attributes)

    # Add Stimulus target and action for drag
    thumb_attrs[:data] ||= {}
    thumb_attrs[:data][:"ui--scroll-area-target"] = "thumb"
    thumb_attrs[:data][:action] = "pointerdown->ui--scroll-area#startDrag"

    if @as_child && block_given?
      # asChild mode: yield attributes to block
      yield(thumb_attrs)
    else
      # Default mode: render as empty div
      div(**thumb_attrs)
    end
  end
end
