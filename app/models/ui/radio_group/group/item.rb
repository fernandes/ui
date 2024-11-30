class UI::RadioGroup::Group::Item < UI::Base
  attr_reader :selected

  def initialize(selected = false, **attrs)
    @selected = selected
    super(**attrs)
  end

  def view_template
    attrs[:aria_checked] = (selected ? "true" : "false")
    attrs[:data][:state] = (selected ? "checked" : "unchecked")

    button(**attrs) do
      span(
        data_state: (selected ? "checked" : "unchecked"),
        class: [
          "flex items-center justify-center",
          ("hidden" unless selected)
        ]
      ) do
        render UI::Icon.new(:circle, class: "h-2.5 w-2.5 fill-current text-current")
      end
    end
  end

  def default_attrs
    {
      type: "button",
      role: "radio",
      aria_checked: "false",
      # value: "comfortable",
      class:
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      id: "r2",
      tabindex: "-1",
      data: {
        state: "unchecked",
        ui__radio_group_target: "radio",
        action: "keydown.up->ui--radio-group#handleKeyUp keydown.left->ui--radio-group#handleKeyUp keydown.down->ui--radio-group#handleKeyDown keydown.right->ui--radio-group#handleKeyDown keydown.esc->ui--radio-group#handleKeyEsc",
      }
    }
  end
end
