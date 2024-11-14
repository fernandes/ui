class UI::Combobox < UI::Base
  include Phlex::DeferredRender

  def initialize(**args)
    @items = []
    super
  end

  ui_attribute :search
  ui_attribute :trigger

  def option(id:, label:, **args)
    item = Item.new(id: id, label: label, **args)
    @items << item
    item
  end

  def view_template
    render UI::Popover.new(scrolls: false, **attrs) do |pop|
      pop.trigger do
        render(@trigger) if @trigger
      end

      pop.content(class: "w-[200px] p-0") do
        div(
          tabindex: "-1",
          class:
            "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          cmdk_root: ""
        ) do
          render(@search)
          div(
            class: "max-h-[300px] overflow-y-auto overflow-x-hidden",
            cmdk_list: "",
            role: "listbox",
            aria_label: "Suggestions",
            id: ":r174:",
            style: "--cmdk-list-height: 168.0px;"
          ) do
            div(cmdk_list_sizer: "") do
              div(
                class:
                  "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
                cmdk_group: "",
                role: "presentation",
                data: {
                  value: "undefined",
                  ui__scroll_buttons_target: :body,
                  action: "scroll->ui--scroll-buttons#checkArrows"
                },
              ) do
                div(cmdk_group_items: "", role: "group") do
                  @items.each do |item|
                    puts "rendeing : #{item}"
                    render(item)
                  end
                end
              end
            end
          end
        end
      end
    end
  end

  class Trigger < UI::Base
    def view_template(&block)
      yield
    end
  end

  class Item < UI::Base
    def initialize(id:, label:, selected: false, icon: nil, **args)
      super
      @id = id
      @label = label
      @selected = selected
      @item_uncheked_class = icon.present? ? "opacity-40" : "opacity-0"
      @icon = icon.present? ? icon : :check
    end

    def view_template
      div(
        class:
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
        id: ":r179:",
        cmdk_item: "",
        role: "option",
        aria_disabled: "false",
        aria_selected: "false",
        data_disabled: "false",
        data_selected: "false",
        data_value: @id
      ) do
        render UI::Icon.new(
          @icon,
          class: [
            "mr-2 h-4 w-4",
            (@selected ? "opacity-100" : @item_uncheked_class)
          ]
        )
        plain @label
      end
    end
  end

  class Search < UI::Base
    def view_template
      placeholder = attrs.delete(:placeholder) || "Search..."
      label(
        cmdk_label: "",
        for: ":r176:",
        id: ":r175:",
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
          aria_controls: ":r174:",
          aria_labelledby: ":r175:",
          id: ":r176:",
          value: ""
        )
      end
    end
  end
end
