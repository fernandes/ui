class UI::Toggle < UI::Base
  attr_reader :icon, :toogle

  def initialize(icon, variant: :primary, size: :md, toogle: false, **attrs)
    @icon = icon
    @toogle = toogle
    @variant = variant
    @size = size
    super(**attrs)
  end

  def view_template(&block)
    button(**attrs) do
      render UI::Icon.new(icon, class: "h-4 w-4")
      if block
        yield
      end
    end
  end

  def default_attrs
    {
      type: "button",
      aria_pressed: (toogle ? "true" : "false"),
      data_state: (toogle ? "on" : "off"),
      data: {
        controller: :ui__toggle,
        action: [
          "click->ui--toggle#handleClick"
        ]
      },
      class: [
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2 bg-transparent ",
        ("border border-input hover:bg-accent hover:text-accent-foreground" if @variant.to_sym == :outline),
        # sizes
        ("h-9 px-2.5 min-w-9" if @size.to_sym == :sm),
        ("h-10 px-3 min-w-10" if @size.to_sym == :md),
        ("h-11 px-5 min-w-11" if @size.to_sym == :lg)
      ]
    }
  end
end
