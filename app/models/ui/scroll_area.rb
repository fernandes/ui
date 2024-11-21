class UI::ScrollArea < UI::Base
  def view_template(&block)
    div(**attrs) do
      style do
        "[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}"
      end
      div(
        data_radix_scroll_area_viewport: "",
        class: "h-full w-full rounded-[inherit]",
        style: "overflow:hidden scroll"
      ) do
        div(style: "min-width:100%;display:table", &block)
      end
      div(
        data_orientation: "vertical",
        data_state: "visible",
        class:
          "flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]",
        style:
          "position: absolute; top: 0px; right: 0px; bottom: var(--radix-scroll-area-corner-height); --radix-scroll-area-thumb-height: 42.48117154811715px;"
      ) do
        div(
          data_state: "visible",
          class: "relative flex-1 rounded-full bg-border",
          style:
            "width: var(--radix-scroll-area-thumb-width); height: var(--radix-scroll-area-thumb-height); transform: translate3d(0px, 170.519px, 0px);"
        )
      end
    end
  end

  def default_attrs
    {
      dir: "ltr",
      class: "relative overflow-hidden",
      style:
        "position: relative; --radix-scroll-area-corner-width: 0px; --radix-scroll-area-corner-height: 0px;"
    }
  end
end
