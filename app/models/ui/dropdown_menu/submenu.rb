class UI::DropdownMenu < UI::Base
  class Submenu < UI::Base
    include Common

    attr_reader :label, :icon

    def initialize(label, icon:, margin_left: false, placement: :right_start, no_padding: true, **attrs)
      @label = label
      @icon = icon
      @placement = placement
      @no_padding = no_padding
      @submenu_margin_left = margin_left
      super(**attrs)
    end

    def no_padding?
      true
    end

    def view_template(&block)
      div(**attrs) do
        if icon.present?
          render UI::Icon.new(icon)
        elsif @submenu_margin_left
          div(class: "h-4 w-4")
        end
        span { label }
        render UI::Icon.new(:chevron_right, class: "ml-auto")
        div(
          class: [
            "ui-popover-content z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-content min-w-[250px] data-[state=closed]:hidden",
            ("p-1" unless no_padding?),
            ("p-0" if no_padding?)
          ],
          data: {
            controller: :ui__dropdown_content,
            state: :closed,
            ui__dropdown_submenu_target: :content,
            action: [
              "keydown.up->ui--dropdown-content#handleKeyUp",
              "keydown.down->ui--dropdown-content#handleKeyDown",
              "keydown.left->ui--dropdown-content#handleKeyLeft",
              "keydown.esc->ui--dropdown-content#handleKeyEsc:stop",
              "focus->ui--dropdown-content#handleFocus:self:stop",
              "ui--dropdown-submenu:content-closed->ui--dropdown-content#handleContentClosed:stop"
            ]
          },
          style: {top: "10px", left: "230px", position: :absolute},
          &block
        )
      end
    end

    def default_attrs
      {
        role: "menuitem",
        id: "radix-:r3vk:",
        aria_haspopup: "menu",
        aria_expanded: "false",
        data_state: "closed",
        class:
          "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full",
        tabindex: "-1",
        data_orientation: "vertical",
        data_radix_collection_item: "",
        data: {
          controller: :ui__dropdown_submenu,
          # ui__dropdown_menu_target: :item,
          ui__dropdown_content_target: :item,
          action: [
            "mouseenter->ui--dropdown-submenu#handleMouseEnter",
            # "mouseenter->ui--dropdown-submenu#handleMouseLeave",
            "keydown.right->ui--dropdown-submenu#handleSubmenuKeyRight",
            "mouseenter->ui--dropdown-content#handleMouseEnterItem",
            "ui--dropdown-content:mouseenter->ui--dropdown-submenu#handleMouseEnterContentItem",

            # "keydown.left->ui--dropdown-menu#handleSubmenuKeyLeft:capture:stop",
            # "keydown.left->ui--dropdown-menu#handleKeyLeft",
            # "keydown.right->ui--dropdown-menu#handleKeyRight",
            "ui--dropdown-content:closerequest->ui--dropdown-submenu#handleContentCloseRequest:stop"
          ]
        }
      }
    end
  end
end
