class UI::Separator < UI::Base
  def initialize(orientation: :horizontal, **attrs)
    @orientation = orientation.to_sym
    super(**attrs)
  end

  def view_template
    div(**attrs)
  end

  def default_attrs
    {
      class: [
        "shrink-0 bg-border h-[1px] w-full",
        ("h-[1px] w-full" if @orientation == :horizontal),
        ("w-[1px] h-full" if @orientation == :vertical)
      ],
      data: {
        orientation: @orientation
      },
      role: :none
    }
  end
end
