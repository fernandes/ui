# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Dialog Title (and Sheet Title)
#
# Marks the title as the `title` target so the Stimulus controller can give it
# an id and point the content's aria-labelledby at it. An `id` passed by the
# caller is kept; otherwise the controller generates a unique one.
module UI::DialogTitleBehavior
  def dialog_title_base_classes
    "text-lg font-semibold"
  end

  def dialog_title_classes
    UI::ClassMerger.merge([dialog_title_base_classes, @classes].compact.join(" "))
  end

  def dialog_title_html_attributes
    attrs = (@attributes || {}).except(:class, :data)
    user_data = @attributes&.fetch(:data, {}) || {}
    attrs.merge(
      class: dialog_title_classes,
      data: user_data.merge(ui__dialog_target: "title")
    )
  end
end
