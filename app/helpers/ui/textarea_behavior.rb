# frozen_string_literal: true

module UI
  # TextareaBehavior
  #
  # Shared behavior for Textarea component across ERB, ViewComponent, and Phlex implementations.
  # This module provides consistent styling and HTML attribute generation for textarea elements.
  module TextareaBehavior
    # Returns HTML attributes for the textarea element
    def textarea_html_attributes
      {
        class: textarea_classes,
        placeholder: @placeholder,
        name: @name,
        rows: @rows
      }.compact
    end

    # Returns combined CSS classes for the textarea
    def textarea_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        textarea_base_classes,
        classes_value

      ].compact.join(" "))
    end

    private

    # Base classes applied to all textareas (from shadcn/ui)
    def textarea_base_classes
      "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    end
  end
end
