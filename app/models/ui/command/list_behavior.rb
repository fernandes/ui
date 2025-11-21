# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Command
    # ListBehavior
    #
    # Shared behavior for CommandList component.
    module ListBehavior
      def command_list_html_attributes
        {
          class: command_list_classes,
          data: command_list_data_attributes,
          role: "listbox"
        }
      end

      def command_list_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          command_list_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def command_list_data_attributes
        {
          slot: "command-list",
          ui__command_target: "list"
        }
      end

      private

      def command_list_base_classes
        "max-h-[300px] overflow-x-hidden overflow-y-auto"
      end
    end
  end
end
