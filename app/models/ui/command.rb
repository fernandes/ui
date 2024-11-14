class UI::Command < UI::Base
  include Phlex::DeferredRender

  def initialize(**attrs)
    @groups = []
    super
  end

  ui_attribute :search

  def group(name, **attrs, &block)
    group = Group.new(name, **attrs)
    @groups << group
    block.yield(group)
    group
  end

  class Search < UI::Base
    def view_template
      placeholder = attrs.delete(:placeholder) || "Type a command or search..."
      label(
        cmdk_label: "",
        for: ":r4ae:",
        id: ":r4ad:",
        style:
          "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0"
      )
      div(class: "flex items-center border-b px-3", cmdk_input_wrapper: "") do
        render UI::Icon.new(:search, class: "mr-2 h-4 w-4 shrink-0 opacity-50")
        input(
          class:
            "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          placeholder: placeholder,
          cmdk_input: "",
          autocomplete: "off",
          autocorrect: "off",
          spellcheck: "false",
          aria_autocomplete: "list",
          role: "combobox",
          aria_expanded: "true",
          aria_controls: ":r4ac:",
          aria_labelledby: ":r4ad:",
          id: ":r4ae:",
          value: ""
        )
      end
    end
  end

  class Group < UI::Base
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
          class:
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
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
            data_value: "Suggestions"
          ) do
            div(cmdk_group_heading: "", aria_hidden: "true", id: ":r4ag:") do
              "Suggestions"
            end
            div(cmdk_group_items: "", role: "group", aria_labelledby: ":r4ag:") do
              @items.each { |i| render(i) }
            end
          end
        end
      end
    end
  end

  def view_template
    key = attrs.delete(:key) || "ctrl+p"
    open = attrs.delete(:open) || false
    render UI::Modal.new(
      class: [
        ("p-0"),
        ("hidden" unless open)
      ],
      data: { controller: "dialog", action: "keydown.#{key}->modal#open"}
    ) do
      div(
        tabindex: "-1",
        class: [
          ("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"),
        ],
        cmdk_root: ""
      ) do
        render(@search) if @search
        @groups.each { |g| render(g) }
      end
    end
  end
end
