# frozen_string_literal: true

require "tailwind_merge"

    # EmptyBehavior
    #
    # Shared behavior for CommandEmpty component.
    module UI::CommandEmptyBehavior
      def command_empty_html_attributes
        {
          class: command_empty_classes,
          data: command_empty_data_attributes
        }
      end

      def command_empty_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          command_empty_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def command_empty_data_attributes
        {
          slot: "command-empty",
          ui__command_target: "empty"
        }
      end

      private

      def command_empty_base_classes
        "py-6 text-center text-sm hidden"
      end
    end
