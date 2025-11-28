# frozen_string_literal: true

module UI
  # Checkbox Behavior - Shared logic for checkbox component across ERB, ViewComponent, and Phlex
  module CheckboxBehavior
    def checkbox_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        type: "checkbox",
        class: checkbox_classes,
        name: @name,
        id: checkbox_id,
        value: @value,
        checked: (@checked ? true : nil),
        disabled: (@disabled ? true : nil),
        required: (@required ? true : nil),
        data: checkbox_data_attributes,
        "aria-checked": @checked ? "true" : "false"
      }.merge(attributes_value).compact
    end

    def checkbox_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        checkbox_base_classes,
        classes_value

      ].compact.join(" "))
    end

    def checkbox_data_attributes
      {
        controller: "ui--checkbox",
        state: @checked ? "checked" : "unchecked"
      }
    end

    def checkbox_id
      @id || "checkbox-#{SecureRandom.hex(4)}"
    end

    private

    def checkbox_base_classes
      "peer appearance-none border-input dark:bg-input/30 checked:bg-primary checked:text-primary-foreground dark:checked:bg-primary checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
    end
  end
end
