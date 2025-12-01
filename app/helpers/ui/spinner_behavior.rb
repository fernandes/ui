# frozen_string_literal: true

module UI
  # SpinnerBehavior
  #
  # Shared behavior for Spinner component across ERB, ViewComponent, and Phlex implementations.
  # This module provides consistent size variants and HTML attribute generation.
  module SpinnerBehavior
    # Returns HTML attributes for the spinner element
    def spinner_html_attributes
      {
        class: spinner_classes,
        role: "status",
        "aria-label": "Loading",
        data: {slot: "spinner"}
      }
    end

    # Returns combined CSS classes for the spinner
    def spinner_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        spinner_base_classes,
        spinner_size_classes,
        classes_value
      ].compact.join(" "))
    end

    private

    # Base classes applied to all spinners
    def spinner_base_classes
      "animate-spin"
    end

    # Size-specific classes based on @size
    def spinner_size_classes
      case @size.to_s
      when "sm"
        "size-3"
      when "lg"
        "size-6"
      when "xl"
        "size-8"
      else # default
        "size-4"
      end
    end
  end
end
