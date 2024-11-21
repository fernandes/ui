class UI::HoverCard < UI::Base
  def trigger(**attrs, &block)
    @popover.trigger do
      div(**attrs, &block)
    end
  end

  def content(**attrs, &block)
    @popover.content(class: "p-4") do
      div(**attrs, &block)
    end
  end

  def view_template(&block)
    render @popover = UI::Popover.new(action: :hover, mouseout: :close, open_delay: 700, close_delay: 300) do |popover|
      div(**attrs, &block)
    end
  end
end
