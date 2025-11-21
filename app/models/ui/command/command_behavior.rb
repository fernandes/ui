# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Command
    # CommandBehavior
    #
    # Shared behavior for Command root component.
    module CommandBehavior
      def command_html_attributes
        {
          class: command_classes,
          data: command_data_attributes
        }
      end

      def command_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          command_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def command_data_attributes
        {
          controller: "ui--command",
          slot: "command",
          ui__command_loop_value: @loop.to_s
        }
      end

      private

      def command_base_classes
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md"
      end
    end
  end
end
