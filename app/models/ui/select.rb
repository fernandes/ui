class UI::Select < UI::Base
  include Phlex::DeferredRender

  ui_attribute :trigger
  ui_attribute :content

  attr_reader :value

  def initialize(value: nil, **attrs)
    @value = value
    super(**attrs)
  end

  def view_template(&block)
    div(**attrs) do
      render UI::Popover.new(placement: "bottom-start", scrolls: true) do |pop|
        pop.trigger do
          render(@trigger)
        end

        pop.content(class: "p-0") do
          @content.selected_value = value
          render(@content)
        end
      end
    end
  end

  def default_attrs
    {
      data: {
        controller: :ui__select,
        action: [
          "ui--popover:open->ui--select#handlePopoverOpen",
          "ui--popover:close->ui--select#handlePopoverClose",
          "ui--select-item:mouseover->ui--select#cleanHovered",
          "ui--select-item:checked->ui--select#handleChecked",
          "keydown.down->ui--select#handleKeyDown",
          "keydown.up->ui--select#handleKeyUp",
          "keydown.enter->ui--select#handleEnter",
          "keydown.space->ui--select#handleEnter",
          "keydown.esc->ui--select#handleEsc"
        ]
      }
    }
  end

  class Trigger < UI::Base
    include Phlex::DeferredRender
    ui_attribute :value

    def view_template(&block)
      button(**attrs) do
        render(@value)
        render UI::Icon.new(:chevron_down, class: "h-4 w-4 opacity-50")
      end
    end

    def default_attrs
      {
        type: "button",
        role: "combobox",
        aria_controls: "radix-:rp:",
        aria_expanded: "false",
        aria_autocomplete: "none",
        dir: "ltr",
        data_state: "closed",
        data_placeholder: "",
        data: {
          state: "closed",
          placeholder: "",
          ui__select_target: :trigger
        },
        class:
        " flex h-10  items-center justify-between rounded-md border border-input bg-background px-3  py-2  text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2  focus:ring-ring focus:ring-offset-2  disabled:cursor-not-allowed disabled:opacity-50 [& amp;>span]:line-clamp-1 w-[280px]"
      }
    end

    class Value < UI::Base
      def view_template(&block)
        span(**attrs, &block)
      end

      def default_attrs
        {
          style: "pointer-events:none",
          class: "span-label"
        }
      end
    end
  end

  class Content < UI::Base
    include Phlex::DeferredRender
    attr_accessor :selected_value

    def group(**attrs, &block)
      @groups ||= []
      group = Group.new(**attrs, &block)
      block.call(group)
      @groups << group
    end

    def view_template(&block)
      @groups.each { |g| g.selected_value = selected_value }
      div(**attrs) do
        @groups.each { |g| render(g) }
      end
    end

    def default_attrs
      {
        data_radix_select_viewport: "",
        role: "presentation",
        class:
          "p-1 h-[250px] w-full min-w-[var(--radix-select-trigger-width)]",
        style: "position:relative;flex:1 1 0;overflow:auto;max-height: inherit;",
        data: {
          ui__scroll_buttons_target: :body,
          action: "scroll->ui--scroll-buttons#checkArrows",
          ui__select_target: :content
        }
      }
    end

    class Group < UI::Base
      attr_accessor :selected_value
      ui_attribute :label

      def item(**attrs, &block)
        @items ||= []
        @items << Item.new(**attrs, &block)
      end

      def view_template(&block)
        @items.each { |i| i.selected_value = selected_value }

        div(role: "group", aria_labelledby: "radix-:r1jp:") do
          render(@label) if @label

          @items.each { |i| render(i) }
        end
      end

      def default_attrs
        {}
      end

      class Label < UI::Base
        def view_template(&block)
          div(id: "radix-:r1jp:", class: "py-1.5 pl-8 pr-2 text-sm font-semibold", &block)
        end
      end

      class Item < UI::Base
        attr_accessor :selected_value

        def view_template(&block)
          checked = attrs[:value].to_s == selected_value&.to_s
          attrs[:data][:state] = checked ? "checked" : "unchecked"
          div(**attrs) do
            span(
              class: [
                "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                ("hidden" unless checked)
              ]
            ) do
              span(aria_hidden: true) do
                render UI::Icon.new(:check, class: "h-4 w-4")
              end
            end
            span(id: "radix-:r1jq:", class: "span-label", &block)
          end
        end

        def default_attrs
          {
            role: "option",
            aria_labelledby: "radix-:r1jq:",
            aria_selected: "false",
            data: {
              state: "unchecked",
              controller: :ui__select_item,
              action: [
                "mouseover->ui--select-item#handleMouseover",
                "mouseout->ui--select-item#handleMouseout",
                "click->ui--select-item#handleClick",
                "click->ui--popover#closePopover",
              ],
              ui__select_target: :item
            },
            tabindex: "-1",
            class:
              "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground",
          }
        end
      end
    end
  end
end
