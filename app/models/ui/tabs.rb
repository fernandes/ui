class UI::Tabs < UI::Base
  attr_reader :active

  def initialize(active:, **attrs)
    @active = label_to_value(active)
    super(**attrs)
  end

  def value_active?(value)
    value == active
  end

  def label_to_value(label)
    label.parameterize.underscore
  end

  def list(&block)
    div(
      role: "tablist",
      aria_orientation: "horizontal",
      class:
        "h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-2",
      tabindex: "0",
      data_orientation: "horizontal",
      style: "outline:none",
      &block
    )
  end

  def trigger_for(label)
    value = label_to_value(label)
    active = value_active?(value)
    button(
      type: "button",
      role: "tab",
      aria_selected: (active ? "true" : "false"),
      aria_controls: "ui--tabs-content-#{value}",
      data_state: (active ? "active" : "inactive"),
      id: "ui--tabs-trigger-#{value}",
      class:
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      tabindex: "-1",
      data_orientation: "horizontal",
      data_radix_collection_item: "",
      data: {
        ui__tabs_target: :trigger,
        action: "ui--tabs#handleTriggerClick"
      }
    ) { label }
  end

  def content_for(label, &block)
    value = label_to_value(label)
    active = value_active?(value)
    div(
      data_state: (active ? "active" : "inactive"),
      data_orientation: "horizontal",
      role: "tabpanel",
      aria_labelledby: "ui--tabs-trigger-#{value}",
      id: "ui--tabs-content-#{value}",
      tabindex: "0",
      class:
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=inactive]:hidden",
      style: "animation-duration:0",
      data: {
        ui__tabs_target: :content
      },
      &block
    )
  end

  def view_template(&block)
    div(**attrs, &block)
  end

  def default_attrs
    {
      dir: "ltr",
      data_orientation: "horizontal",
      data: {
        controller: "ui--tabs"
      }
    }
  end
end
