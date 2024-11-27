class UI::ContextMenu < UI::Base
  def view_template(&block)
    div(
      data_radix_popper_content_wrapper: "",
      style:
        "position: fixed; left: 0px; top: 0px; transform: translate(689px, 143px); min-width: max-content; --radix-popper-transform-origin: 0px 0%; z-index: 50; --radix-popper-available-width: 1036px; --radix-popper-available-height: 325px; --radix-popper-anchor-width: 0px; --radix-popper-anchor-height: 0px;",
      dir: "ltr"
    ) do
      div(
        data_side: "right",
        data_align: "start",
        role: "menu",
        aria_orientation: "vertical",
        data_state: "open",
        data_radix_menu_content: "",
        dir: "ltr",
        class:
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-64",
        style:
          "outline: none; --radix-context-menu-content-transform-origin: var(--radix-popper-transform-origin); --radix-context-menu-content-available-width: var(--radix-popper-available-width); --radix-context-menu-content-available-height: var(--radix-popper-available-height); --radix-context-menu-trigger-width: var(--radix-popper-anchor-width); --radix-context-menu-trigger-height: var(--radix-popper-anchor-height); pointer-events: auto;",
        tabindex: "-1",
        data_orientation: "vertical",
        &block
      )
    end
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

  def view_templatez
    div(
      data_radix_popper_content_wrapper: "",
      style:
        "position: fixed; left: 0px; top: 0px; transform: translate(689px, 143px); min-width: max-content; --radix-popper-transform-origin: 0px 0%; z-index: 50; --radix-popper-available-width: 1036px; --radix-popper-available-height: 325px; --radix-popper-anchor-width: 0px; --radix-popper-anchor-height: 0px;",
      dir: "ltr"
    ) do
      div(
        data_side: "right",
        data_align: "start",
        role: "menu",
        aria_orientation: "vertical",
        data_state: "open",
        data_radix_menu_content: "",
        dir: "ltr",
        class:
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-64",
        style:
          "outline: none; --radix-context-menu-content-transform-origin: var(--radix-popper-transform-origin); --radix-context-menu-content-available-width: var(--radix-popper-available-width); --radix-context-menu-content-available-height: var(--radix-popper-available-height); --radix-context-menu-trigger-width: var(--radix-popper-anchor-width); --radix-context-menu-trigger-height: var(--radix-popper-anchor-height); pointer-events: auto;",
        tabindex: "-1",
        data_orientation: "vertical"
      ) do
        div(
          role: "menuitem",
          class:
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-8",
          tabindex: "-1",
          data_orientation: "vertical",
          data_radix_collection_item: ""
        ) do
          plain "Back"
          span(class: "ml-auto text-xs tracking-widest text-muted-foreground") do
            "⌘["
          end
        end
        div(
          role: "menuitem",
          aria_disabled: "true",
          data_disabled: "",
          class:
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-8",
          tabindex: "-1",
          data_orientation: "vertical",
          data_radix_collection_item: ""
        ) do
          plain "Forward"
          span(class: "ml-auto text-xs tracking-widest text-muted-foreground") do
            "⌘]"
          end
        end
        div(
          role: "menuitem",
          class:
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-8",
          tabindex: "-1",
          data_orientation: "vertical",
          data_radix_collection_item: ""
        ) do
          plain "Reload"
          span(class: "ml-auto text-xs tracking-widest text-muted-foreground") do
            "⌘R"
          end
        end
        div(
          role: "menuitem",
          id: "radix-:r7c:",
          aria_haspopup: "menu",
          aria_expanded: "false",
          aria_controls: "radix-:r7b:",
          data_state: "closed",
          class:
            "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground pl-8",
          tabindex: "-1",
          data_orientation: "vertical",
          data_radix_collection_item: ""
        ) do
          plain "More Tools"
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "lucide lucide-chevron-right ml-auto h-4 w-4"
          ) { |s| s.path(d: "m9 18 6-6-6-6") }
        end
        div(
          role: "separator",
          aria_orientation: "horizontal",
          class: "-mx-1 my-1 h-px bg-border"
        )
        div(
          role: "menuitemcheckbox",
          aria_checked: "true",
          class:
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          data_state: "checked",
          tabindex: "-1",
          data_orientation: "vertical",
          data_radix_collection_item: ""
        ) do
          span(
            class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
          ) do
            span(data_state: "checked") do
              svg(
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewbox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                stroke_width: "2",
                stroke_linecap: "round",
                stroke_linejoin: "round",
                class: "lucide lucide-check h-4 w-4"
              ) { |s| s.path(d: "M20 6 9 17l-5-5") }
            end
          end
          plain "Show Bookmarks Bar"
          span(class: "ml-auto text-xs tracking-widest text-muted-foreground") do
            "⌘⇧B"
          end
        end
        div(
          role: "menuitemcheckbox",
          aria_checked: "false",
          class:
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          data_state: "unchecked",
          tabindex: "-1",
          data_orientation: "vertical",
          data_radix_collection_item: ""
        ) do
          span(
            class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
          )
          plain "Show Full URLs"
        end
        div(
          role: "separator",
          aria_orientation: "horizontal",
          class: "-mx-1 my-1 h-px bg-border"
        )
        div(role: "group") do
          div(class: "px-2 py-1.5 text-sm font-semibold text-foreground pl-8") do
            "People"
          end
          div(
            role: "separator",
            aria_orientation: "horizontal",
            class: "-mx-1 my-1 h-px bg-border"
          )
          div(
            role: "menuitemradio",
            aria_checked: "true",
            class:
              "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            data_state: "checked",
            tabindex: "-1",
            data_orientation: "vertical",
            data_radix_collection_item: ""
          ) do
            span(
              class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
            ) do
              span(data_state: "checked") do
                svg(
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewbox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  stroke_width: "2",
                  stroke_linecap: "round",
                  stroke_linejoin: "round",
                  class: "lucide lucide-circle h-2 w-2 fill-current"
                ) { |s| s.circle(cx: "12", cy: "12", r: "10") }
              end
            end
            plain "Pedro Duarte"
          end
          div(
            role: "menuitemradio",
            aria_checked: "false",
            class:
              "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            data_state: "unchecked",
            tabindex: "-1",
            data_orientation: "vertical",
            data_radix_collection_item: ""
          ) do
            span(
              class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
            )
            plain "Colm Tuite"
          end
        end
      end
    end
  end
end
