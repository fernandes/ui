# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Dialog Description (and Sheet Description)
#
# Marks the description as the `description` target so the Stimulus controller
# can give it an id and point the content's aria-describedby at it. An `id`
# passed by the caller is kept.
module UI::DialogDescriptionBehavior
  def dialog_description_base_classes
    "text-muted-foreground text-sm"
  end

  def dialog_description_classes
    UI::ClassMerger.merge([dialog_description_base_classes, @classes].compact.join(" "))
  end

  def dialog_description_html_attributes
    attrs = (@attributes || {}).except(:class, :data)
    user_data = @attributes&.fetch(:data, {}) || {}
    attrs.merge(
      class: dialog_description_classes,
      data: user_data.merge(ui__dialog_target: "description")
    )
  end
end
