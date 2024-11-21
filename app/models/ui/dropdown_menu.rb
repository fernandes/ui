class UI::DropdownMenu < UI::Base
  module Common
    def submenu(label, icon:, **attrs, &block)
      render UI::DropdownMenu::Submenu.new(label, icon: icon, **attrs, &block)
    end

    def separator(**attrs, &block)
      render UI::DropdownMenu::Separator.new(**attrs, &block)
    end

    def item(label, icon:, key: nil, **attrs, &block)
      render UI::DropdownMenu::Item.new(label, icon: icon, key: key, **attrs, &block)
    end

    def group(**attrs, &block)
      render UI::DropdownMenu::Group.new(**attrs, &block)
    end

    def radio_group(value:, **attrs, &block)
      render UI::DropdownMenu::RadioGroup.new(value, **attrs, &block)
    end

    def checkbox_item(checked: false, disabled: false, **attrs, &block)
      render UI::DropdownMenu::Checkbox.new(checked: checked, disabled: disabled, **attrs, &block)
    end
  end

  include Common

  class Item < UI::Base
    attr_reader :label, :icon, :key

    def initialize(label, icon:, key:, **attrs)
      @label = label
      @icon = icon
      @key = key
      super(**attrs)
    end

    def view_template
      div(
        role: "menuitem",
        class:
          "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        tabindex: "-1",
        data_orientation: "vertical",
        data_radix_collection_item: ""
      ) do
        render UI::Icon.new(icon) if icon
        span { label }
        if key.present?
          span(class: "ml-auto text-xs tracking-widest opacity-60") { UI::KeyToHuman.convert(key) }
        end
      end
    end
  end

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
      div(role: :group, **attrs, &block)
    end
  end

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

  class Label < UI::Base
    def view_template(&block)
      div(**attrs, &block)
    end

    def default_attrs
      {
        class: "px-2 py-1.5 text-sm font-semibold"
      }
    end
  end

  class Separator < UI::Base
    def view_template
      div(
        role: "separator",
        aria_orientation: "horizontal",
        class: "-mx-1 my-1 h-px bg-muted"
      )
    end
  end

  class Group < UI::Base
    include Common

    def view_template(&block)
      div(role: :group, &block)
    end
  end

  class Submenu < UI::Base
    include Common

    attr_reader :label, :icon

    def initialize(label, icon:, **attrs)
      @label = label
      @icon = icon
      super(**attrs)
    end

    def view_template(&block)
      render UI::Popover.new(action: :hover, placement: :right_start, class: "w-full") do |pop|
        pop.trigger(class: "w-full") do
          div(**attrs) do
            render UI::Icon.new(icon) if icon.present?
            span { label }
            render UI::Icon.new(:chevron_right, class: "ml-auto")
          end
        end

        pop.content(class: "p-1") do
          div(&block)
        end
      end
    end

    def default_attrs
      {
        role: "menuitem",
        id: "radix-:r3vk:",
        aria_haspopup: "menu",
        aria_expanded: "true",
        aria_controls: "radix-:r3vj:",
        data_state: "open",
        class:
          "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        tabindex: "-1",
        data_orientation: "vertical",
        data_radix_collection_item: ""
      }
    end
  end

  class Trigger < UI::Base
    def view_template(&block)
      div(**attrs, &block)
    end
  end

  def trigger(**attrs, &block)
    @popover.trigger do
      render Trigger.new(**attrs, &block)
    end
  end

  def menu_content(**attrs, &block)
    @popover.content(class: "p-1") do
      div(**attrs, &block)
    end
  end

  def view_template(&block)
    render @popover = UI::Popover.new do |popover|
      div(**attrs, &block)
    end
  end

  def label(**attrs, &block)
    render UI::DropdownMenu::Label.new(**attrs, &block)
  end
end
