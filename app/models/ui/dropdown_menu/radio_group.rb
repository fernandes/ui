class UI::DropdownMenu < UI::Base
  class RadioGroup < UI::Base
    attr_reader :value

    class RadioItem < UI::Base
      attr_reader :value

      def initialize(value:, selected:, **attrs)
        @value = value
        @selected = selected

        super(**attrs)
      end

      def selected?
        @value == @selected
      end

      def view_template(&block)
        div(**attrs) do
          span(class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center ") do
            span(class: "data-[state=unchecked]:hidden", data_state: (selected? ? "checked" : "unchecked")) do
              render UI::Icon.new(:circle, class: "h-2 w-2 fill-current")
            end
          end
          yield
        end
      end

      def default_attrs
        {
          role: "menuitemradio",
          aria_checked: selected? ? "true" : "false",
          class:
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          tabindex: selected? ? "0" : "-1",
          data_orientation: "vertical",
          data_radix_collection_item: "",
          data: {
            orientation: :vertical,
            state: selected? ? "checked" : "unchecked",
            ui__dropdown_radio_group_target: "radio",
            ui__dropdown_menu_target: :item,
            ui__dropdown_content_target: :item,
            action: [
              # "keydown.up->ui--radio-group#handleKeyUp",
              # "keydown.left->ui--radio-group#handleKeyUp",
              # "keydown.down->ui--radio-group#handleKeyDown",
              # "keydown.right->ui--radio-group#handleKeyDown",
              "keydown.esc->ui--radio-group#handleKeyEsc",
              "mouseenter->ui--dropdown-content#handleMouseEnterItem",
              "mouseleave->ui--dropdown-content#handleMouseLeaveItem",
              "click->ui--dropdown-radio-group#handleClick",
              "keydown.enter->ui--dropdown-radio-group#handleClick:capture",
              "keydown.space->ui--dropdown-radio-group#handleClick:capture"
            ],
          }
        }
      end
    end

    def initialize(value, **attrs)
      @value = value
      super(**attrs)
    end

    def radio(value:, **attrs, &block)
      render RadioItem.new(value: value, selected: @value, **attrs, &block)
    end

    def view_template(&block)
      div(role: :group, data: {ui__dropdown_menu_target: :content}, **attrs, &block)
    end

    def default_attrs
      {
        data: {
          controller: :ui__dropdown_radio_group,
        }
      }
    end
  end
end
