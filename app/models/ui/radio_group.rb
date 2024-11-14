class UI::RadioGroup < UI::Base
  include Phlex::DeferredRender

  def initialize(value: nil, **attrs)
    @value = value.present? ? value : ""
    @groups = []
    super
  end

  def group(**attrs, &block)
    group = Group.new(selected_value: @value, **attrs)
    block.yield(group)
    @groups << group
  end

  def view_template
    div(**attrs) do
      @groups.each { |g| render(g) }
    end
  end

  def default_attrs
    {
      role: "radiogroup",
      aria_required: "false",
      dir: "ltr",
      class: "grid gap-2",
      tabindex: "0",
      style: "outline:none",
      data: {
        controller: :ui__radio_group
      }
    }
  end
end
