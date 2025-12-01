# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Dialog Footer component
module UI::DialogFooterBehavior
  # Returns HTML attributes for the dialog footer
  def dialog_footer_html_attributes
    {
      class: dialog_footer_classes
    }
  end

  # Returns combined CSS classes for the dialog footer
  def dialog_footer_classes
    TailwindMerge::Merger.new.merge([
      dialog_footer_base_classes,
      @classes
    ].compact.join(" "))
  end

  # Base classes applied to dialog footer
  def dialog_footer_base_classes
    "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
  end
end
