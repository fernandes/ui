class UI::Dialog < UI::Base
  include Phlex::DeferredRender

  class Trigger < UI::Base
    def view_template(&block)
      div(&block)
    end
  end

  class Content < UI::Base
    include Phlex::DeferredRender

    ui_attribute :header
    ui_attribute :body
    ui_attribute :footer

    class Header < UI::Base
      def title(**attrs, &block)
        h2(class: "text-lg font-semibold leading-none tracking-tight", **attrs, &block)
      end

      def description(**attrs, &block)
        p(class: "text-sm text-muted-foreground", **attrs, &block)
      end

      def view_template(&block)
        div(**attrs, &block)
      end

      def default_attrs
        {
          class: "flex flex-col space-y-1.5 text-center sm:text-left"
        }
      end
    end

    class Body < UI::Base
      def close(&block)
        div(&block)
      end

      def view_template(&block)
        div(&block)
      end
    end

    class Footer < UI::Base
      def close(&block)
        div(&block)
      end

      def view_template(&block)
        div(&block)
      end

      def default_attrs
        {
          class: "flex flex-col-reverse sm:flex-row sm:space-x-2 sm:justify-start"
        }
      end
    end

    def view_template(&block)
      render @header
      render @body
      render @footer
    end

    def default_attrs
      {
        class: "flex flex-col space-y-1.5 text-center sm:text-left"
      }
    end
  end

  ui_attribute :trigger
  ui_attribute :content

  def initialize(open: false, **attrs)
    @open = open
    super(**attrs)
  end

  def open?
    @open
  end

  def view_template(&block)
    render @trigger if @trigger
    render UI::Backdrop.new(
      class: [
        ("hidden" unless open?)
      ]
    )
    div(**attrs) do
      render @content if @content
      button(
        type: "button",
        class:
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      ) do
        render UI::Icon.new(:x, class: "h-4 w-4")
        span(class: "sr-only") { "Close" }
      end
    end
  end

  def default_attrs
    {
      class: "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-md data-[state=closed]:hidden",
      role: :dialog,
      data: {
        state: open? ? :open : :closed
      },
      tabindex: -1,
      style: "pointer-events: auto;"
    }
  end
end
