# frozen_string_literal: true

# ResizableHandle component (Phlex)
# Draggable handle between resizable panels
#
# @example Basic handle
#   render UI::Handle.new
#
# @example Handle with visible grip icon
#   render UI::Handle.new(with_handle: true)
class UI::ResizableHandle < Phlex::HTML
  include UI::ResizableHandleBehavior

  # @param with_handle [Boolean] show visible grip icon
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(with_handle: false, classes: "", attributes: {}, **)
    @with_handle = with_handle
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template
    div(**handle_html_attributes) do
      if @with_handle
        div(class: grip_container_classes) do
          render_grip_icon
        end
      end
    end
  end

  private

  def render_grip_icon
    # GripVertical icon from lucide
    svg(
      xmlns: "http://www.w3.org/2000/svg",
      width: "10",
      height: "10",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      stroke_width: "2",
      stroke_linecap: "round",
      stroke_linejoin: "round",
      class: "h-2.5 w-2.5"
    ) do |s|
      s.circle(cx: "9", cy: "12", r: "1")
      s.circle(cx: "9", cy: "5", r: "1")
      s.circle(cx: "9", cy: "19", r: "1")
      s.circle(cx: "15", cy: "12", r: "1")
      s.circle(cx: "15", cy: "5", r: "1")
      s.circle(cx: "15", cy: "19", r: "1")
    end
  end
end
