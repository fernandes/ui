# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Drawer Title component
# Rendered as <h2> (Vaul Drawer.Title = Radix Dialog.Title) and marked as the
# `title` target so the controller can give it an id and point the content's
# aria-labelledby at it. An `id` passed by the caller is kept.
module UI::DrawerTitleBehavior
  # Base CSS classes for drawer title
  def drawer_title_base_classes
    "text-foreground font-semibold"
  end

  # Merge base classes with custom classes using TailwindMerge
  def drawer_title_classes
    UI::ClassMerger.merge([drawer_title_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for title
  def drawer_title_html_attributes
    base_attrs = (@attributes || {}).except(:class, :data)
    user_data = @attributes&.fetch(:data, {}) || {}
    base_attrs.merge(
      class: drawer_title_classes,
      data: user_data.merge(ui__drawer_target: "title")
    )
  end
end
