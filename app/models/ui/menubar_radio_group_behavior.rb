# frozen_string_literal: true

    # MenubarRadioGroupBehavior
    #
    # Shared behavior for MenubarRadioGroup component across ERB, ViewComponent, and Phlex implementations.
    module UI::MenubarRadioGroupBehavior
      # Returns HTML attributes for the radio group
      def menubar_radio_group_html_attributes
        {
          class: menubar_radio_group_classes,
          data: menubar_radio_group_data_attributes,
          role: "group"
        }
      end

      # Returns combined CSS classes for the radio group
      def menubar_radio_group_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the radio group
      def menubar_radio_group_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = {}

        # Store the current value if provided
        base_data[:"ui--menubar-radio-value"] = @value if defined?(@value) && @value

        (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
      end
    end
