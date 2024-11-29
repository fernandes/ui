class UI::Collapsible < UI::Base
  attr_reader :open

  def initialize(open: false, **attrs)
    @open = open
    super(**attrs)
  end

  class Trigger < UI::Base
    def initialize(icon: :chevrons_up_down, open: false, **attrs, &block)
      @icon = icon
      @open = open
      super(**attrs)
    end

    def default_attrs
      {
        aria_expanded: @open.to_s,
        data: {
          ui__collapsible_target: :trigger,
          action: [
            "click->ui--collapsible#handleClick"
          ],
          state: @open ? "open" : "closed"
        }
      }
    end

    def view_template
      render UI::Button.new(variant: "ghost", size: "sm", class: "w-9 p-0", **attrs) do
        render UI::Icon.new(@icon, class: "h-4 w-4")
        span(class: "sr-only") { "Toggle" }
      end
    end
  end

  def trigger(icon = :chevrons_up_down, **attrs, &block)
    render Trigger.new(icon: icon, open: @open, **attrs, &block)
  end

  def content(**attrs, &block)
    render Content.new(open: @open, **attrs, &block)
  end

  class Content < UI::Base
    def initialize(open: false, **attrs, &block)
      @open = open
      super(**attrs)
    end

    def default_attrs
      {
        class: "data-[state=closed]:hidden",
        data: {
          ui__collapsible_target: :content,
          state: (@open ? "open" : "closed")
        }
      }
    end

    def view_template(&block)
      div(**attrs, &block)
    end
  end

  def view_template(&block)
    div(**attrs, &block)
  end

  def default_attrs
    {
      data: {
        state: open ? "open" : "closed",
        controller: :ui__collapsible
      },
    }
  end
end
