# frozen_string_literal: true

module UI
  # InputBehavior
  #
  # Shared behavior for Input component across ERB, ViewComponent, and Phlex implementations.
  # This module provides consistent styling and HTML attribute generation for form inputs.
  module InputBehavior
    # Returns HTML attributes for the input element
    def input_html_attributes
      {
        type: @type,
        class: input_classes,
        placeholder: @placeholder,
        value: @value,
        name: @name,
        id: @id,
        readonly: @readonly,
        data: { slot: "input" }
      }.compact
    end

    # Returns combined CSS classes for the input
    def input_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        input_base_classes,
        input_focus_classes,
        input_validation_classes,
        classes_value

      ].compact.join(" "))
    end

    private

    # Base classes applied to all inputs (from shadcn/ui)
    def input_base_classes
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    end

    # Focus state classes
    def input_focus_classes
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
    end

    # Validation state classes
    def input_validation_classes
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
    end
  end
end
