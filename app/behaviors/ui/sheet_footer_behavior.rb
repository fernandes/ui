# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Sheet Footer component
module UI::SheetFooterBehavior
  # Returns HTML attributes for the sheet footer
  def sheet_footer_html_attributes
    {
      class: sheet_footer_classes
    }
  end

  # Returns combined CSS classes for the sheet footer
  def sheet_footer_classes
    TailwindMerge::Merger.new.merge([
      sheet_footer_base_classes,
      @classes
    ].compact.join(" "))
  end

  # Base classes applied to sheet footer
  # Different from Dialog: uses mt-auto and p-4
  def sheet_footer_base_classes
    "mt-auto flex flex-col gap-2 p-4"
  end
end
