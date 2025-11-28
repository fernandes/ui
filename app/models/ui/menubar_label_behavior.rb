# frozen_string_literal: true

    # MenubarLabelBehavior
    #
    # Shared behavior for MenubarLabel component across ERB, ViewComponent, and Phlex implementations.
    module UI::MenubarLabelBehavior
      # Returns HTML attributes for the label
      def menubar_label_html_attributes
        {
          class: menubar_label_classes,
          data: menubar_label_data_attributes
        }
      end

      # Returns combined CSS classes for the label
      def menubar_label_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        inset_class = inset? ? "pl-8" : ""

        TailwindMerge::Merger.new.merge([
          "px-2 py-1.5 text-sm font-medium",
          inset_class,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the label
      def menubar_label_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = {}
        base_data[:inset] = "" if inset?

        (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
      end

      private

      def inset?
        defined?(@inset) && @inset
      end
    end
