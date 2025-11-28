# frozen_string_literal: true

require "tailwind_merge"

    # SeparatorBehavior
    #
    # Shared behavior for CommandSeparator component.
    module UI::CommandSeparatorBehavior
      def command_separator_html_attributes
        {
          class: command_separator_classes,
          data: { slot: "command-separator" },
          role: "separator"
        }
      end

      def command_separator_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          command_separator_base_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      def command_separator_base_classes
        "-mx-1 h-px bg-border"
      end
    end
