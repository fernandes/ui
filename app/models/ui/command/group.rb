class UI::Command::Group < UI::Base
  include Phlex::DeferredRender

  class Item < UI::Base
    attr_reader :name, :icon, :key

    def initialize(name, icon, key, **attrs)
      @name = name
      @icon = icon
      @key = key
      super(**attrs)
    end

    def view_template
      div(**attrs) do
        if icon
          render UI::Icon.new(icon, class: "mr-2 h-4 w-4")
        end
        span { name }
        if key
          span(
            class: "ml-auto text-xs tracking-widest text-muted-foreground"
          ) { UI::KeyToHuman.convert(key) }
        end
      end
    end

    def default_attrs
      {
        class: "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
        id: ":r4ah:",
        cmdk_item: "",
        role: "option",
        aria_disabled: "false",
        aria_selected: "false",
        data_disabled: "false",
        data_selected: "false",
        data_value: "Calendar"
      }
    end
  end

  def initialize(name, **attrs)
    @name = name
    @items = []
    super(**attrs)
  end

  def default_attrs
    {
      class: "max-h-[300px] overflow-y-auto overflow-x-hidden",
      cmdk_list: "",
      role: "listbox",
      aria_label: "Suggestions",
      id: ":r4ac:",
      style: "--cmdk-list-height: 333.0px;"
    }
  end

  def item(name, icon: nil, key: nil, **attrs)
    item = Item.new(name, icon, key, **attrs)
    @items << item
    item
  end

  def view_template
    div(**attrs) do
      div(cmdk_list_sizer: "") do
        div(
          class:
            "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
          cmdk_group: "",
          role: "presentation",
          data_value: @name
        ) do
          div(cmdk_group_heading: "", aria_hidden: "true", id: ":r4ag:") { @name }
          div(cmdk_group_items: "", role: "group", aria_labelledby: ":r4ag:") do
            @items.each { |i| render(i) }
          end
        end
      end
    end
  end
end
