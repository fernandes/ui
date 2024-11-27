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
          data_state: selected? ? "checked" : "unchecked",
          tabindex: "-1",
          data_orientation: "vertical",
          data_radix_collection_item: ""
        }
      end
    end

    def initialize(value, **attrs)
      @value = value
      super(**attrs)
    end

    def radio_item(value:, **attrs, &block)
      render RadioItem.new(value: value, selected: @value, **attrs, &block)
    end

    def view_template(&block)
      div(role: :group, data: {ui__dropdown_menu_target: :content}, **attrs, &block)
    end
  end
end
