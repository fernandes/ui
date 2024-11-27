class UI::DropdownMenu < UI::Base
  class Item < UI::Base
    attr_reader :label, :icon, :key

    def initialize(label, icon:, key:, level: 0, **attrs)
      @label = label
      @icon = icon
      @key = key
      @level = level
      super(**attrs)
    end

    def view_template
      div(
        role: "menuitem",
        class:
          "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        tabindex: "-1",
        data_orientation: "vertical",
        data: {
          dropdown_level: @level,
          highlighted: false,
          ui__dropdown_menu_target: :item,
          ui__dropdown_content_target: :item,
          action: [
            "mouseenter->ui--dropdown-content#handleMouseEnterItem",
            "mouseleave->ui--dropdown-content#handleMouseLeaveItem"
          ]
        }
      ) do
        render UI::Icon.new(icon) if icon
        span { label }
        if key.present?
          span(class: "ml-auto text-xs tracking-widest opacity-60") { UI::KeyToHuman.convert(key) }
        end
      end
    end
  end
end
