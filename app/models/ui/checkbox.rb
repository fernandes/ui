class UI::Checkbox < UI::Base
  def initialize(**args)
    @checked = args.delete(:checked) || false
    super
  end

  def view_template
    button(
      type: "button",
      role: "checkbox",
      aria_checked: checked? ? "true" : "false",
      value: "on",
      class:
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      data: {
        state: checked? ? "checked" : "unchecked",
        controller: :ui__checkbox,
        action: [
          "click->ui--checkbox#handleToggle"
        ]
      }
    ) do
      span(
        class: [
          "flex items-center justify-center text-current",
          ("hidden" unless checked?)
        ],
        style: "pointer-events:none",
        data: {
          state: checked? ? "checked" : "unchecked",
          ui__checkbox_target: :span
        }
      ) do
        render UI::Icon.new(:check, class: "h-4 w-4")
      end
    end
  end

  def checked?
    @checked
  end
end
