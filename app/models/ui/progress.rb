class UI::Progress < UI::Base
  attr_reader :percentage

  def initialize(percentage, **attrs)
    @percentage = percentage.to_i
    puts percentage.inspect
    super(**attrs)
  end

  def view_template
    translate = percentage - 100
    div(**attrs) do
      div(
        data_state: "indeterminate",
        data_max: "100",
        class: "h-full w-full flex-1 bg-primary transition-all",
        style: "transform:translateX(#{translate}%)"
      )
    end
  end

  def default_attrs
    {
      aria_valuemax: "100",
      aria_valuemin: "0",
      role: "progressbar",
      data_state: "indeterminate",
      data_max: "100",
      class: "relative h-4 overflow-hidden rounded-full bg-secondary w-[60%]"
    }
  end
end
