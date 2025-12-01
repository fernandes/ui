# frozen_string_literal: true

class UI::SheetContent < Phlex::HTML
  include UI::SheetContentBehavior

  # @param side [String] Position of the sheet: "top", "right", "bottom", "left"
  # @param open [Boolean] Whether the sheet is open
  # @param show_close [Boolean] Whether to show the built-in close button
  # @param classes [String] Additional CSS classes
  def initialize(side: "right", open: false, show_close: true, classes: nil, **attributes)
    @side = side
    @open = open
    @show_close = show_close
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**sheet_content_html_attributes) do
      yield if block_given?

      # Built-in close button (like shadcn)
      if @show_close
        button(
          class: sheet_content_close_button_classes,
          data: {action: "click->ui--dialog#close"}
        ) do
          render_x_icon
          span(class: "sr-only") { "Close" }
        end
      end
    end
  end

  private

  # Render X icon as inline SVG (Lucide icon)
  def render_x_icon
    svg(
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      stroke_width: "2",
      stroke_linecap: "round",
      stroke_linejoin: "round",
      class: "size-4"
    ) do |s|
      s.path(d: "M18 6 6 18")
      s.path(d: "m6 6 12 12")
    end
  end
end
