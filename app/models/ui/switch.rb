class UI::Switch < UI::Base
  def view_template
    @checked = attrs.delete(:checked) || false
    attrs[:data][:state] = @checked ? "checked" : "unchecked"
    attrs[:aria_checked] = @checked ? "true" : "false"
    button(**attrs) do
      span(
        data: {
          state: attrs[:data][:state],
          ui__switch_target: :span
        },
        class:
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )
    end
  end

  def default_attrs
    {
      type: "button",
      role: "switch",
      aria_checked: "false",
      value: "on",
      class:
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      data: {
        state: (@checked ? "checked" : "unchecked"),
        controller: :ui__switch,
        action: "click->ui--switch#handleToggle"
      }
    }
  end
end
