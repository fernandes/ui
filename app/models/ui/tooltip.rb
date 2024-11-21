class UI::Tooltip < UI::Base
  def trigger(**attrs, &block)
    @popover.trigger do
      div(**attrs, &block)
    end
  end

  def content(**attrs, &block)
    @popover.content(class: "overflow-hidden px-3 py-1.5 text-sm") do
      div(**attrs, &block)
    end
  end

  def view_template(&block)
    render @popover = UI::Popover.new(action: :hover, mouseout: :close, open_delay: 700, close_delay: 300, placement: :top) do |popover|
      div(**attrs, &block)
    end
  end
end
