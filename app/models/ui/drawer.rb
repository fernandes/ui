class UI::Drawer < UI::Base
  include Phlex::DeferredRender

  ui_attribute :trigger
  ui_attribute :content

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
      def title(&block)
        h2(
          id: "radix-:r3f1:",
          class: "text-lg font-semibold leading-none tracking-tight",
          &block
        )
      end

      def description(**attrs, &block)
        p(id: "radix-:r3f2:", class: "text-sm text-muted-foreground", &block)
      end

      def view_template(&block)
        div(class: "grid gap-1.5 p-4 text-center sm:text-left", &block)
      end
    end

    class Body < UI::Base
      def title(&block)
        div(**attrs, &block)
      end

      def description(**attrs, &block)
        div(**attrs, &block)
      end
    end

    class Footer < UI::Base
      def view_template(&block)
        div(class: "mx-auto w-full max-w-sm") do
          div(class: "mt-auto flex flex-col gap-2 p-4", &block)
        end
      end
    end

    def view_template(&block)
      render UI::Backdrop.new
      div(**attrs) do
        div(class: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted")
        div(class: "mx-auto w-full max-w-sm") do
          render @header
          render @body
          render @footer
        end
      end
    end

    def default_attrs
      {
        role: "dialog",
        id: "radix-:r3f0:",
        aria_describedby: "radix-:r3f2:",
        aria_labelledby: "radix-:r3f1:",
        data_state: "open",
        data_vaul_drawer_direction: "bottom",
        data_vaul_drawer: "",
        data_vaul_delayed_snap_points: "false",
        data_vaul_snap_points: "false",
        data_vaul_custom_container: "false",
        data_vaul_animate: "true",
        class:
      "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        tabindex: "-1",
        style: "pointer-events:auto"
      }
    end
  end

  def view_template(&block)
    render @trigger
    render @content
  end
end
