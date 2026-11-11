# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Drawer Description component
# Marked as the `description` target so the controller can point the
# content's aria-describedby at it. An `id` passed by the caller is kept.
module UI::DrawerDescriptionBehavior
  # Base CSS classes for drawer description
  def drawer_description_base_classes
    "text-muted-foreground text-sm"
  end

  # Merge base classes with custom classes using TailwindMerge
  def drawer_description_classes
    UI::ClassMerger.merge([drawer_description_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for description
  def drawer_description_html_attributes
    base_attrs = (@attributes || {}).except(:class, :data)
    user_data = @attributes&.fetch(:data, {}) || {}
    base_attrs.merge(
      class: drawer_description_classes,
      data: user_data.merge(ui__drawer_target: "description")
    )
  end
end
