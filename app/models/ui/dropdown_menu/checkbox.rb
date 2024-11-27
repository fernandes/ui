class UI::DropdownMenu < UI::Base
  class Checkbox < UI::Base
    def initialize(checked: false, disabled: false, **attrs)
      @checked = checked
      @disabled = disabled
      super(**attrs)
    end

    def checked?
      @checked == true
    end

    def disabled?
      @disabled
    end

    def view_template(&block)
      div(**attrs) do
        span(class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center") do
          span(data_state: (checked? ? "checked" : "unchecked"), class: "data-[state=unchecked]:hidden") do
            render UI::Icon.new(:check, class: "h-4 w-4")
          end
        end
        yield
      end
    end

    def default_attrs
      default = {
        role: "menuitemcheckbox",
        aria_checked: checked? ? "true" : "false",
        class:
    "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        data_state: checked? ? "checked" : "unchecked",
        tabindex: "-1",
        data_orientation: "vertical",
        data_radix_collection_item: ""
      }
      if disabled?
        default[:data_disabled] = "" if disabled?
        default[:aria_disabled] = "true"
      end
      default
    end
  end
end
