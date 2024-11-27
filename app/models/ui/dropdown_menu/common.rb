class UI::DropdownMenu < UI::Base
  module Common
    def submenu(label, icon: nil, placement: :right_start, **attrs, &block)
      render UI::DropdownMenu::Submenu.new(label, icon: icon, placement: placement, level: @level, **attrs, &block)
    end

    def separator(**attrs, &block)
      render UI::DropdownMenu::Separator.new(**attrs, &block)
    end

    def item(label, icon: nil, key: nil, **attrs, &block)
      render UI::DropdownMenu::Item.new(label, level: @level, icon: icon, key: key, **attrs, &block)
    end

    def group(**attrs, &block)
      render UI::DropdownMenu::Group.new(level: @level, **attrs, &block)
    end

    def radio_group(value:, **attrs, &block)
      render UI::DropdownMenu::RadioGroup.new(value, **attrs, &block)
    end

    def checkbox_item(checked: false, disabled: false, **attrs, &block)
      render UI::DropdownMenu::Checkbox.new(checked: checked, disabled: disabled, **attrs, &block)
    end
  end
end
