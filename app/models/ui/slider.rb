class UI::Slider < UI::Base
  attr_reader :range, :percentage

  def initialize(value, min: 0, max: 100, **attrs)
    @value = value
    @range = max - min
    @percentage = ((value.to_f / range.to_f) * 100).to_i
    super(**attrs)
  end

  def view_template
    right = 100 - percentage
    adjust = (1 - (percentage.to_f / 50)) * 10
    adjust_signal = (adjust >= 0) ? "+" : "-"
    span(
      **attrs
    ) do
      span(
        data_orientation: "horizontal",
        class: "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
      ) do
        span(
          data_orientation: "horizontal",
          class: "absolute h-full bg-primary",
          style: "left:0;right:#{right}%"
        )
      end
      span(
        style:
        "transform: var(--radix-slider-thumb-transform); position: absolute; left: calc(#{percentage}% #{adjust_signal} #{adjust.round(2).abs}px);"
      ) do
        span(
          role: "slider",
          aria_valuemin: "0",
          aria_valuemax: "100",
          aria_orientation: "horizontal",
          data_orientation: "horizontal",
          tabindex: "0",
          class:
            "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          style: "",
          data_radix_collection_item: "",
          aria_valuenow: "0"
        )
      end
    end
  end

  def default_attrs
    {
      dir: "ltr",
      data_orientation: "horizontal",
      aria_disabled: "false",
      class: "relative flex touch-none select-none items-center",
    }
  end
end
