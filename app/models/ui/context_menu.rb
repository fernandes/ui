class UI::ContextMenu < UI::Base
  def default_attrs
    {
      data: {
        controller: :ui__context_menu
      }
    }
  end

  def view_template(&block)
    div(**attrs, &block)
  end

  def trigger(**attrs, &block)
    render Trigger.new(**attrs, &block)
  end

  def content(**attrs, &block)
    render Content.new(**attrs, &block)
  end

  class Trigger < UI::Base
    def default_attrs
      {
        data: {
          ui__context_menu_target: :trigger,
          action: [
            "contextmenu->ui--context-menu#handleContextMenu:prevent",
            "keydown.esc@window->ui--context-menu#handleEsc",
            "click->ui--context-menu#closePopover"
          ]
        }
      }
    end

    def view_template(&block)
      div(**attrs, &block)
    end
  end

  class Content < UI::Base
    def default_attrs
      {
        data: {
          side: :right,
          align: :start,
          state: :closed,
          orientation: :vertical,
          ui__context_menu_target: :content,
        },
        role: "menu",
        aria_orientation: "vertical",
        dir: "ltr",
        class:
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-64 data-[state=closed]:hidden",
        style: [
          "position: absolute;",
        ],
        tabindex: "-1",
      }
    end

    def view_template(&block)
      div(**attrs, &block)
    end

    def item(text:, key: nil, disabled: false, icon: nil, variant: :primary, **attrs, &block)
      render Item.new(disabled: disabled, variant: variant, **attrs) do
        if icon.present?
          render UI::Icon.new(icon, class: "mr-2 h-4 w-4")
        end
        plain text
        if key.present?
          span(
            class: [
              "ml-auto text-xs tracking-widest text-muted-foreground focus:text-accent-foreground",
              ("text-red-600" if variant.to_sym == :destructive)
            ]
          ) do
            UI::KeyToHuman.convert(key)
          end
        end
      end
    end

    class Item < UI::Base
      def initialize(variant: :primary, **attrs, &block)
        @variant = variant
        super(**attrs)
      end

      def view_template(&block)
        div(**attrs, &block)
      end

      def default_attrs
        {
          role: "menuitem",
          class: [
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-8",
            ("focus:text-accent-foreground text-red-600" if @variant.to_sym == :destructive)
          ],
          tabindex: "-1",
          data_orientation: "vertical",
          data_radix_collection_item: ""
        }
      end
    end

    def separator
      div(
        role: "separator",
        aria_orientation: "horizontal",
        class: "-mx-1 my-1 h-px bg-border"
      )
    end

    def checkbox(text:, key: nil, checked: false, &block)
      div(
        role: "menuitemcheckbox",
        aria_checked: checked ? "true" : false,
        class:
          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        data_state: checked ? "checked" : "unchecked",
        tabindex: "-1",
        data_orientation: "vertical",
        data_radix_collection_item: ""
      ) do
        span(
          class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
        ) do
          span(
            data_state: checked ? "checked" : "unchecked",
            class: [
              ("hidden" unless checked)
            ]
          ) do
            render UI::Icon.new(:check, class: "h-4 w-4")
          end
        end
        plain text
        if key
          span(class: "ml-auto text-xs tracking-widest text-muted-foreground") do
            UI::KeyToHuman.convert(key)
          end
        end
      end
    end

    def radio_group(title, &block)
      div(role: "group") do
        div(class: "px-2 py-1.5 text-sm font-semibold text-foreground pl-8") do
          title
        end
        div(
          role: "separator",
          aria_orientation: "horizontal",
          class: "-mx-1 my-1 h-px bg-border",
        )
        yield
      end
    end

    def radio(text:, selected: false)
      div(
        role: "menuitemradio",
        aria_checked: selected ? "true" : "false",
        class:
          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        data_state: selected ? "checked" : "unchecked",
        tabindex: "-1",
        data_orientation: "vertical",
        data_radix_collection_item: ""
      ) do
        span(
          class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
        ) do
          span(
            data_state: (selected ? "checked" : "unchecked"),
            class: [
              ("hidden" unless selected)
            ]
          ) do
            render UI::Icon.new(:circle, class: "h-2 w-2 fill-current")
          end
        end
        plain text
      end
    end
  end
end
