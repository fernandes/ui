class UI::ContextMenu < UI::Base
  def default_attrs
    {
      data: {
        controller: :ui__context_menu,
        ui__popover_target: :receiver,
        action: [
          "ui--popover:open->ui--context-menu#handlePopoverOpen",
          "ui--popover:close->ui--context-menu#handlePopoverClose",
          "keydown.esc@window->ui--context-menu#handleEsc",
          "keydown.esc@window->ui--context-menu#handleEsc",
          "keydown@window->ui--context-menu#handleKeyDown",
        ],
      }
    }
  end

  def view_template(&block)
    render @popover = UI::Popover.new(action: :contextmenu, placement: :cursor) do
      div(**attrs, &block)
    end
  end

  def trigger(popover_class: [], **attrs, &block)
    default_classes = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
    merged_classes = UI::Base::TAILWIND_MERGER.merge([default_classes, popover_class])
    @popover.trigger(tabindex: 0, data: {ui__context_menu_target: :trigger}, class: merged_classes) do
      render Trigger.new(**attrs, &block)
    end
  end

  def content(**attrs, &block)
    @popover.content(class: "p-0 w-[280px]") do
      render Content.new(**attrs, &block)
    end
  end

  class Trigger < UI::Base
    def default_attrs
      {}
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
          state: :open,
          orientation: :vertical,
        },
        role: "menu",
        aria_orientation: "vertical",
        dir: "ltr",
        tabindex: "-1",
      }
    end

    def view_template(&block)
      render @dropdown = UI::DropdownMenu.new(visible: true, margin_left: true, data: {ui__context_menu_target: :dropdown}) do |d|
        d.menu_content(class: "w-[278px]") do |m|
          m.group do |grp|
            @group = grp
            div(**attrs, &block)
          end
        end
      end
    end

    def item(text, key: nil, disabled: false, icon: nil, variant: :primary, **attrs, &block)
      @group.item(text, key: key, disabled: disabled, icon: icon, variant: variant, **attrs, &block)
    end

    def separator(**attrs)
      @group.separator(**attrs)
    end

    def checkbox(value: nil, checked: false, **attrs, &block)
      @group.checkbox(value: value, checked: checked, **attrs, &block)
    end

    def radio_group(value:, **attrs, &block)
      @dropdown.radio_group(value: value, **attrs, &block)
    end

    def label(**attrs, &block)
      @dropdown.label(**attrs, &block)
    end

    def submenu(text, **attrs, &block)
      @dropdown.submenu(text, **attrs, &block)
    end

    # def radio(text:, selected: false)
    #   div(
    #     role: "menuitemradio",
    #     aria_checked: selected ? "true" : "false",
    #     class:
    #       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    #     data_state: selected ? "checked" : "unchecked",
    #     tabindex: "-1",
    #     data_orientation: "vertical",
    #     data_radix_collection_item: ""
    #   ) do
    #     span(
    #       class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
    #     ) do
    #       span(
    #         data_state: (selected ? "checked" : "unchecked"),
    #         class: [
    #           ("hidden" unless selected)
    #         ]
    #       ) do
    #         render UI::Icon.new(:circle, class: "h-2 w-2 fill-current")
    #       end
    #     end
    #     plain text
    #   end
    # end
  end
end
