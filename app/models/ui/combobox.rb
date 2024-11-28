class UI::Combobox < UI::Base
  include Phlex::DeferredRender

  def initialize(hide_check_marks: false, **args)
    @items = []
    @hide_check_marks = hide_check_marks
    super
  end

  ui_attribute :search
  ui_attribute :trigger

  def option(id:, label:, **args)
    if args[:selected]
      @selected_label = label
    end
    item = Item.new(id: id, label: label, hide_check_marks: @hide_check_marks, **args)
    @items << item
    item
  end

  def view_template
    unless @trigger.present?
      return div(
        data: {
          controller: "ui--combobox",
          action: [
            "ui--combobox-content:checked->ui--combobox#handleItemChecked",
            "ui--popover:open->ui--combobox#handlePopoverOpen",
            "ui--popover:close->ui--combobox#handlePopoverClose",
            "focus->ui--combobox#handleFocus:self",
            # "keydown.esc@window->ui--combobox#handleEsc",
            # "keydown.enter@window->ui--combobox#handleEnter",
            # "keydown.space@window->ui--combobox#handleSpace",
          ]
        }
      ) { render_content }
    end

    render UI::Popover.new(scrolls: false, **attrs) do |pop|
      div(
        data: {
          controller: "ui--combobox",
          ui__popover_target: :receiver,
          action: [
            "ui--combobox-content:checked->ui--combobox#handleItemChecked",
            "ui--popover:open->ui--combobox#handlePopoverOpen",
            "ui--popover:close->ui--combobox#handlePopoverClose",
            # "keydown.esc@window->ui--combobox#handleEsc",
            # "keydown.enter@window->ui--combobox#handleEnter",
            # "keydown.space@window->ui--combobox#handleSpace",
          ]
        }
      ) do
        pop.trigger do
          @trigger.selected_label = @selected_label
          render(@trigger) if @trigger
        end

        pop.content(class: "w-[200px] p-0") do
          render_content
        end
      end
    end
  end

  def render_content
    div(
      tabindex: "-1",
      class:
        "h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      data: {
        controller: [
          "ui--combobox-content",
          ("ui--filter" if @search.present?),
        ],
        ui__popover_target: :receiver,
        ui__combobox_content_search_value: @search.present?.to_s,
        action: [
          "keydown.up->ui--combobox-content#handleUp",
          "keydown.down->ui--combobox-content#handleDown",
          "keydown.enter->ui--combobox-content#handleEnter",
          "ui--popover:open->ui--combobox-content#handlePopoverOpen",
          "ui--popover:close->ui--combobox-content#handlePopoverClose",
          "ui--popover:close->ui--filter#handlePopoverClose",
          "ui--filter:filtered->ui--combobox-content#handleFilterApplied",
        ]
      }
    ) do
      render(@search) if @search
      div(
        class: "max-h-[300px] overflow-y-auto overflow-x-hidden",
        role: "listbox",
        aria_label: "Suggestions",
        id: ":r174:",
      ) do
        div do
          div(
            class:
              "overflow-hidden p-1 text-foreground",
            role: "presentation",
            data: {
              value: "undefined",
              ui__scroll_buttons_target: :body,
              action: "scroll->ui--scroll-buttons#checkArrows"
            },
          ) do
            render Items.new(@items)
          end
        end
      end
    end
  end

  class Items < UI::Base
    def initialize(items, **attrs)
      @items = items
      super(**attrs)
    end

    def view_template
      div(**attrs) do
        @items.each do |item|
          render(item)
        end
      end
    end

    def default_attrs
      {
        role: "group",
        data: {}
      }
    end
  end

  class Trigger < UI::Base
    include Phlex::DeferredRender

    attr_accessor :selected_label

    def button(text, **attrs, &block)
      @button = Button.new(text: text, **attrs, &block)
    end

    def view_template(&block)
      if @button
        @button.selected_label = selected_label
        render @button
      end
    end

    class Button < UI::Base
      attr_reader :text
      attr_accessor :selected_label

      def initialize(text:, **attrs, &block)
        @text = text
        super(**attrs)
      end

      def view_template(&block)
        render UI::Button.new(**attrs) do
          span { @selected_label || @text }
          render UI::Icon.new(:chevrons_up_down, class: "ml-2 h-4 w-4 shrink-0 opacity-50")
        end
      end

      def default_attrs
        {
          class: "text-primary text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between",
          data: {
            ui__combobox_target: :trigger,
            placeholder: @text,
          }
        }
      end
    end
  end

  class Item < UI::Base
    def initialize(id:, label:, selected: false, icon: nil, hide_check_marks: false, **args)
      super
      @id = id
      @label = label
      @selected = selected
      @item_unchecked_class = icon.present? ? "opacity-40" : "opacity-0"
      @icon = icon.present? ? icon : :check
      @hide_check_marks = hide_check_marks
    end

    def view_template
      div(
        class:
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
        id: ":r179:",
        role: "option",
        aria_disabled: "false",
        aria_selected: "false",
        aria_checked: (@selected ? "true" : "false"),
        data_disabled: "false",
        data_selected: "false",
        data_checked: (@selected ? "true" : "false"),
        data_value: @id,
        data: {
          ui__filter_target: :item,
          ui__filter_search_value: @label.downcase,
          ui__combobox_content_target: :item,
          action: [
            "click->ui--combobox-content#handleClick",
            "mouseenter->ui--combobox-content#handleMouseEnter",

          ]
        }
      ) do
        if @icon == :check && @hide_check_marks
        else
          render UI::Icon.new(
            @icon,
            class: [
              "mr-2 h-4 w-4",
              (@selected ? "opacity-100" : @item_unchecked_class)
            ],
            data: {
              unchecked_class: @item_unchecked_class
            }
          )
        end
        plain @label
      end
    end
  end

  class Search < UI::Base
    def view_template
      placeholder = attrs.delete(:placeholder) || "Search..."
      label(
        for: ":r176:",
        id: ":r175:",
        style:
          "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0"
      )
      div(class: "flex items-center border-b px-3") do
        render UI::Icon.new(:search, class: "mr-2 h-4 w-4 shrink-0 opacity-50")
        input(
          class:
            "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          placeholder: placeholder,
          autocomplete: "off",
          autocorrect: "off",
          spellcheck: "false",
          aria_autocomplete: "list",
          role: "combobox",
          aria_expanded: "true",
          aria_controls: ":r174:",
          aria_labelledby: ":r175:",
          id: ":r176:",
          value: "",
          data: {
            ui__combobox_target: :searchInput,
            ui__filter_target: :input,
            action: [
              "input->ui--filter#handleInput",
              "keydown.left->ui--combobox#handleInputKeyLeft:stop",
              "keydown.right->ui--combobox#handleInputKeyRight:stop",
              "keydown.up->ui--combobox#handleInputKeyUp:prevent",
              "keydown.down->ui--combobox#handleInputKeyDown:prevent",
            ]
          }
        )
      end
    end
  end
end
