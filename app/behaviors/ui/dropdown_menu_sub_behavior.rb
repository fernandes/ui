# frozen_string_literal: true

# DropdownMenuSubBehavior
#
# Shared behavior for DropdownMenuSub component across ERB, ViewComponent, and Phlex implementations.
module UI::DropdownMenuSubBehavior
  # Returns HTML attributes for the submenu container
  def dropdown_menu_sub_html_attributes
    {
      class: dropdown_menu_sub_classes
    }
  end

  # Returns combined CSS classes for the submenu container
  def dropdown_menu_sub_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base_classes = "relative"

    TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
  end
end
