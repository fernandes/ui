class UI::DropdownMenu < UI::Base
  class Group < UI::Base
    include Common

    def initialize(level: 0, **attrs)
      @level = level
      super(**attrs)
    end

    def view_template(&block)
      div(**attrs, &block)
    end

    def default_attrs
      {
        role: :group,
        data: {
          controller: :ui__dropdown_content,
          ui__dropdown_menu_target: :content,
          action: [
            "keydown.up->ui--dropdown-content#handleKeyUp",
            "keydown.down->ui--dropdown-content#handleKeyDown",
            "focus->ui--dropdown-content#handleFocus:self",
            "ui--dropdown-submenu:content-closed->ui--dropdown-content#handleContentClosed:stop"
          ]
        }
      }
    end
  end
end
