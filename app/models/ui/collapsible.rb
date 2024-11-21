class UI::Collapsible < UI::Base
  attr_reader :open

  def initialize(open: false, **attrs)
    @open = open
    super(**attrs)
  end

  def trigger(icon = :chevrons_up_down, **attrs, &block)
    attrs ||= {}
    attrs[:aria_expanded] = (open ? "true" : "false")
    attrs[:data_state] = (open ? "open" : "closed")

    render UI::Button.new(variant: "ghost", size: "sm", class: "w-9 p-0", **attrs) do
      render UI::Icon.new(icon, class: "h-4 w-4")
      span(class: "sr-only") { "Toggle" }
    end
  end

  def content(**attrs, &block)
    attrs ||= {}
    attrs[:data_state] = (open ? "open" : "closed")
    if attrs.key?(:class)
      attrs[:class] = TailwindMerge::Merger.new.merge([attrs[:class], "data-[state=closed]:hidden"]) if @attrs[:class]
    else
      attrs[:class] = "data-[state=closed]:hidden"
    end
    div(**attrs, &block)
  end

  def view_template(&block)
    attrs[:data] ||= {}
    attrs[:data][:state] = open ? "open" : "closed"

    div(**attrs, &block)
  end
end
