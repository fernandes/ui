class UI::Popover < UI::Base
  attr_reader :placement
  attr_reader :scrolls

  def initialize(
    action: :click,
    mouseout: :keep,
    open_delay: 0,
    close_delay: 100,
    placement: :bottom,
    scrolls: false,
    level: 0,
    **attrs
  )
    @action = action
    @placement = placement
    @scrolls = scrolls
    @mouseout = mouseout
    @open_delay = open_delay
    @close_delay = close_delay
    @level = level
    super(**attrs)
  end

  def view_template(&block)
    div(**attrs, &block)
  end

  def default_attrs
    {
      data: {
        controller: "ui--popover",
        action: [
          "ui--popover:click:outside->popover#closePopover",
          "requestopen->ui--popover#openPopover",
          "requestclose->ui--popover#handleRequestClose:passive",
          "resize@window->ui--popover#handleWindowResize"
        ],
        ui__popover: {
          placement_value: placement,
          open_delay_value: @open_delay,
          close_delay_value: @close_delay,
          level_value: @level,
          mouseout_value: @mouseout
        }
      }
    }
  end

  def trigger(**attrs, &block)
    render Trigger.new(action: @action, mouseout: @mouseout, **attrs, &block)
  end

  def content(**attrs, &block)
    render Content.new(action: @action, scrolls: scrolls, **attrs, &block)
  end
end
