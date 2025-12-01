# frozen_string_literal: true

# Shared behavior for TabsTrigger component
# Button that activates associated content
module UI::TabsTriggerBehavior
  # Determine initial state based on value
  def trigger_state
    if @value == @default_value
      "active"
    else
      "inactive"
    end
  end

  # Build complete HTML attributes hash for trigger
  def trigger_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    user_data = @attributes&.fetch(:data, {}) || {}

    trigger_data = {
      ui__tabs_target: "trigger",
      value: @value,
      action: "click->ui--tabs#selectTab"
    }.merge(user_data)

    base_attrs.merge(
      class: [
        "focus-visible:ring-ring/50 data-[state=active]:bg-background data-[state=active]:text-foreground",
        "dark:data-[state=active]:text-foreground inline-flex cursor-default items-center justify-center gap-2",
        "whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium outline-none transition-all",
        "focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        @classes
      ].join(" ").strip,
      type: "button",
      role: "tab",
      "aria-selected": (trigger_state == "active") ? "true" : "false",
      "aria-controls": "tabs-content-#{@value}",
      "data-state": trigger_state,
      "data-orientation": @orientation || "horizontal",
      "data-slot": "tabs-trigger",
      tabindex: (trigger_state == "active") ? "0" : "-1",
      disabled: @disabled || false,
      data: trigger_data
    )
  end
end
