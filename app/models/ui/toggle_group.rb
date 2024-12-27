class UI::ToggleGroup < UI::Base
  def initialize(type: :multiple, **attrs)
    @type = type
    super(**attrs)
  end

  def default_attrs
    {
      data: {
        controller: :ui__toggle_group,
        ui__toggle_group: {
          type_value: @type,
        },
        action: [
          "ui--toggle:press->ui--toggle-group#handleTogglePressed"
        ]
      }
    }
  end

  def item(icon, variant: :primary, size: :md, toggle: false, **attrs)
    data = {
      ui__toggle_group_target: :toggle,
    }
    render UI::Toggle.new(icon, variant: variant, size: size, data: data, toggle: toggle, **attrs)
  end

  def view_template(&block)
    div(**attrs, &block)
  end
end
