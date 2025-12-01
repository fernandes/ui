# frozen_string_literal: true

# Shared behavior for DatePicker input mode (text input + icon button)
module UI::DatePickerInputBehavior
  # Generate data attributes for text input
  def date_picker_input_data_attributes
    {
      ui__datepicker_target: "input",
      action: "input->ui--datepicker#handleInput keydown->ui--datepicker#handleInputKeydown"
    }
  end

  # Build complete HTML attributes hash for text input
  def date_picker_input_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    user_data = @attributes&.fetch(:data, {}) || {}
    base_attrs.merge(
      class: date_picker_input_classes,
      type: "text",
      placeholder: @placeholder,
      value: @value,
      data: user_data.merge(date_picker_input_data_attributes)
    )
  end

  # Input classes
  def date_picker_input_classes
    TailwindMerge::Merger.new.merge([
      # Input base styles
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
      "ring-offset-background",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      # Extra padding for icon button
      "pr-10",
      @classes
    ].compact.join(" "))
  end

  # Icon button data attributes
  def date_picker_icon_button_data_attributes
    {
      ui__datepicker_target: "trigger",
      ui__popover_target: "trigger"
    }
  end

  # Icon button classes (positioned inside input)
  def date_picker_icon_button_classes
    TailwindMerge::Merger.new.merge([
      "absolute top-1/2 right-2 -translate-y-1/2",
      "inline-flex items-center justify-center",
      "h-6 w-6 rounded-sm",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "transition-colors",
      @icon_classes
    ].compact.join(" "))
  end
end
