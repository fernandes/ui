class UI::DropdownMenu < UI::Base
  class Item < UI::Base
    attr_reader :label, :icon, :key

    def initialize(label, icon:, key:, margin_left: false, **attrs)
      @label = label
      @icon = icon
      @key = key
      @margin_left = margin_left
      super(**attrs)
    end

    def has_icon?
      @icon.present?
    end

    def view_template
      div(
        role: "menuitem",
        class: [
          "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          ("pl-8" if !has_icon? && @margin_left)
        ],
        tabindex: "-1",
        data_orientation: "vertical",
        data: {
          highlighted: false,
          ui__dropdown_menu_target: :item,
          ui__dropdown_content_target: :item,
          action: [
            "mouseenter->ui--dropdown-content#handleMouseEnterItem",
            "mouseleave->ui--dropdown-content#handleMouseLeaveItem"
          ]
        }
      ) do
        render UI::Icon.new(icon) if has_icon?
        span { label }
        if key.present?
          span(class: "ml-auto text-xs tracking-widest opacity-60") { UI::KeyToHuman.convert(key) }
        end
      end
    end
  end
end
