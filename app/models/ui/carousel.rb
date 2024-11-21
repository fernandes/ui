class UI::Carousel < UI::Base
  include Phlex::DeferredRender

  ui_collection :item

  class Item < UI::Base
    def view_template(&block)
      div(
        role: "group",
        aria_roledescription: "slide",
        class: "min-w-0 shrink-0 grow-0 basis-full pl-4",
        &block
      )
    end
  end

  def view_template(&block)
    div(
      **attrs
    ) do
      div(class: "overflow-hidden") do
        div(class: "flex -ml-4", style: "transform:translate3d(0, 0, 0)") do
          render(@items)
        end
      end
      button(
        class:
          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground absolute h-8 w-8 rounded-full -left-12 top-1/2 -translate-y-1/2",
        disabled: "disabled"
      ) do
        render UI::Icon.new(:arrow_left, class: "h-4 w-4")
        span(class: "sr-only") { "Previous slide" }
      end
      button(
        class:
          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground absolute h-8 w-8 rounded-full -right-12 top-1/2 -translate-y-1/2"
      ) do
        render UI::Icon.new(:arrow_right, class: "h-4 w-4")
        span(class: "sr-only") { "Next slide" }
      end
    end
  end

  def default_attrs
    {
      class: "relative",
      role: "region",
      aria_roledescription: "carousel"
    }
  end
end
