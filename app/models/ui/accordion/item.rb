class UI::Accordion::Item < UI::Base
  def initialize(open = false, **user_attrs, &block)
    @open = open
    yield(self) if block_given?
    super(**user_attrs)
  end

  def title(value)
    @title = value
  end

  def content(&block)
    @content = Proc.new { yield } if block_given?
  end

  def open
    @open.to_s
  end

  def open?
    @open
  end

  def view_template
    @button_id = "#{id}-button"
    @content_id = "#{id}-content"
    div(
      data_orientation: "vertical",
      class: "border-b",
      data: {
        controller: "accordion-item",
        accordion_item_open_value: open
      }
    ) do
      h3(data_orientation: "vertical", class: "flex") do
        button(
          type: "button",
          aria_expanded: open,
          aria_controls: @content_id,
          id: @button_id,
          data_orientation: "vertical",
          data: {
            action: "click->accordion-item#toggle",
            accordion_item_target: "button" 
          },
          class: "flex flex-1 items-center justify-between py-4 font-medium",
        ) do
          plain @title
          render UI::Icon.new(:chevron_down, class: "h-4 w-4 shrink-0", data: { accordion_item_target: "icon" })
        end
      end
      div(
        role: "region",
        id: @content_id,
        aria_labelledby: @button_id,
        data_orientation: "vertical",
        data: {
          accordion_item_target: "content" 
        },
        class: [
          ("overflow-hidden text-sm"),
          ("h-0" unless open?)
        ],
      ) do
        div(class: "pb-4 pt-0") { @content.call }
      end
    end
  end
end


