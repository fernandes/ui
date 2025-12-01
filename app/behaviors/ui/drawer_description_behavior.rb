# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Drawer Description component
# ARIA-compliant description for drawer
module UI::DrawerDescriptionBehavior
  # Base CSS classes for drawer description
  def drawer_description_base_classes
    "text-muted-foreground text-sm"
  end

  # Merge base classes with custom classes using TailwindMerge
  def drawer_description_classes
    TailwindMerge::Merger.new.merge([drawer_description_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for description
  def drawer_description_html_attributes
    base_attrs = @attributes || {}
    base_attrs.merge(class: drawer_description_classes)
  end
end
