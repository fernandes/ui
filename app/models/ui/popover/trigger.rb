class UI::Popover < UI::Base
  class Trigger < UI::Base
    attr_reader :action

    def initialize(action: :click, mouseout: :keep, **attrs, &block)
      @action = action
      @mouseout = mouseout
      super(**attrs)
    end

    def view_template(&block)
      div(**attrs, &block)
    end

    def default_attrs
      stimulus_action = case action
      when :click
        "click"
      when :contextmenu
        "contextmenu"
      when :hover
        "mouseenter"
      end
      stimulus_method = case action
      when :click
        "toggle"
      when :hover, :contextmenu
        "openPopover"
      end
      {
        class: "w-min",
        data: {
          ui__popover_target: "trigger",
          action: [
            "#{stimulus_action}->ui--popover##{stimulus_method}:prevent",
            "keydown.esc@window->ui--popover#handleEsc:prevent",
            ("mouseleave->ui--popover#closePopover" if @mouseout == :close),
            ("click->ui--popover#closePopover" if action == :contextmenu)
          ]
        }
      }
    end
  end
end
