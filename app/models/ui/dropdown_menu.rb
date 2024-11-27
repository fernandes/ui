class UI::DropdownMenu < UI::Base
  include Common

  def initialize(visible: false, **attrs)
    @visible = visible
    @level ||= 0
    super(**attrs)
  end

  def visible?
    @visible
  end

  def trigger(**attrs, &block)
    if !visible?
      @popover.trigger do
        render Trigger.new(**attrs, &block)
      end
    end
  end

  def menu_content(**attrs, &block)
    if visible?
      div(**attrs, &block)
    else
      @popover.content(class: "p-1", data: {ui__dropdown_menu_target: :content}) do
        div(**default_attrs.deep_merge(attrs), &block)
      end
    end
  end

  def view_template(&block)
    render @popover = UI::Popover.new(level: @level.to_s) do |popover|
      div(**attrs, &block)
    end
  end

  def default_attrs
    {
      data: {
        dropdown_level: @level,
        controller: :ui__dropdown_menu,
        ui__popover_target: :receiver,
        action: [
          # "keydown.up->ui--dropdown-menu#handleKeyUp",
          # "keydown.down->ui--dropdown-menu#handleKeyDown",
          # "keydown.right->ui--dropdown-menu#handleKeyRight",
          # "keydown.left->ui--dropdown-menu#handleKeyLeft",
          "ui--popover:open->ui--dropdown-menu#handlePopoverOpen",
          "ui--popover:close->ui--dropdown-menu#handlePopoverClose",
          "keydown.esc->ui--dropdown-menu#handleEsc"
        ]
      }
    }
  end

  def label(**attrs, &block)
    render UI::DropdownMenu::Label.new(**attrs, &block)
  end
end
