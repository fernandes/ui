class UI::Popover < UI::Base
  class Content < UI::Base
    attr_reader :action, :scrolls

    def initialize(action: :click, scrolls: false, **attrs, &block)
      @action = action
      @scrolls = scrolls
      super(**attrs)
    end

    def has_scrolls?
      @scrolls
    end

    def view_template(&block)
      attrs[:data][:controller] = :ui__scroll_buttons if has_scrolls?

      div(**attrs) do
        scroll(:up) if has_scrolls?
        yield
        scroll(:down) if has_scrolls?
      end
    end

    def scroll(direction = :up)
      div(
        aria_hidden: "true",
        class: [
          "flex cursor-default items-center justify-center py-1 hidden",
          "absolute w-full bg-white z-10 rounded-full",
          ("bottom-0" if direction == :down)
        ],
        style: "flex-shrink:0",
        data: {
          ui__scroll_buttons_target: direction,
          action: [
            ("click->ui--scroll-buttons#scrollUp mouseover->ui--scroll-buttons#mouseoverUp mouseout->ui--scroll-buttons#mouseoutUp" if direction == :up),
            ("click->ui--scroll-buttons#scrollDown mouseover->ui--scroll-buttons#mouseoverDown mouseout->ui--scroll-buttons#mouseoutDown" if direction == :down)
          ]
        }
      ) do
        render UI::Icon.new(:"chevron_#{direction}", class: "h-4 w-4")
      end
    end

    def default_attrs
      {
        class: [
          "ui-popover-content z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        ],
        style: {display: :none, position: :absolute},
        data: {
          ui__popover_target: "content",
          action: [
            "ui--popover:open->ui--scroll-buttons#handlePopoverOpen",
            "ui--popover:close->ui--scroll-buttons#handlePopoverClose",
            "mouseenter->ui--popover#handleMouseenterContent",
            "mouseleave->ui--popover#handleMouseleaveContent",
          ]
        },
        data_side: "bottom",
        data_align: "center",
        data_state: "open",
        role: "dialog",
        tabindex: "-1",
      }
    end
  end
end
