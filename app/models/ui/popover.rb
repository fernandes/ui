class UI::Popover < UI::Base
  include Phlex::DeferredRender
  attr_reader :placement
  attr_reader :scrolls

  def initialize(**attrs)
    @placement = attrs.delete(:placement) || "bottom"
    @scrolls = attrs.delete(:scrolls)
    super
  end

  def view_template(&block)
    div(**attrs) do
      render(@trigger)
      render(@content)
    end
  end

  def default_attrs
    {
      id: :popover,
      data: {
        controller: "ui--popover",
        ui__popover: {
          placement_value: placement
        }
      }
    }
  end

  def trigger(**args, &block)
    @trigger = Trigger.new(**args, &block)
  end

  def content(**args, &block)
    args[:scrolls] = @scrolls
    @content = Content.new(**args, &block)
  end

  class Trigger < UI::Base
    def view_template(&block)
      div(**attrs, &block)
    end

    def default_attrs
      {
        class: "w-min",
        data: {
          ui__popover_target: "trigger",
          action: "click->ui--popover#toggle"
        }
      }
    end
  end

  class Content < UI::Base
    def view_template(&block)
      scrolls = attrs.delete(:scrolls)

      if scrolls
        attrs[:data][:controller] = :ui__scroll_buttons
      end

      div(**attrs) do
        if scrolls
          div(
            aria_hidden: "true",
            class: [
              "flex cursor-default items-center justify-center py-1 hidden",
              "absolute w-full bg-white z-10 rounded-full"
            ],
            style: "flex-shrink:0",
            data: {
              ui__scroll_buttons_target: :up,
              action: "click->ui--scroll-buttons#scrollUp mouseover->ui--scroll-buttons#mouseoverUp mouseout->ui--scroll-buttons#mouseoutUp"
            }
          ) do
            render UI::Icon.new(:chevron_up, class: "h-4 w-4")
          end
        end
        yield
        if scrolls
          div(
            aria_hidden: "true",
            class: [
              "flex cursor-default items-center justify-center py-1 hidden",
              "absolute w-full bg-white z-10 bottom-0 rounded-full"
            ],
            style: "flex-shrink:0",
            data: {
              ui__scroll_buttons_target: :down,
              action: "click->ui--scroll-buttons#scrollDown mouseover->ui--scroll-buttons#mouseoverDown mouseout->ui--scroll-buttons#mouseoutDown"
            }
          ) do
            render UI::Icon.new(:chevron_down, class: "h-4 w-4")
          end
        end
      end
    end

    def default_attrs
      {
        class: "ui-popover-content z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-80",
        style: {display: :none, position: :absolute},
        data: {
          ui__popover_target: "content",
          action: [
            "ui--popover:open->ui--scroll-buttons#handlePopoverOpen",
            "ui--popover:close->ui--scroll-buttons#handlePopoverClose",
          ]
        },
        data_side: "bottom",
        data_align: "center",
        data_state: "open",
        role: "dialog",
        id: "radix-:rhb:",
        tabindex: "-1",
      }
    end
  end
end
