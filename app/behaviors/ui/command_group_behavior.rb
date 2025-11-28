# frozen_string_literal: true

require "tailwind_merge"

    # GroupBehavior
    #
    # Shared behavior for CommandGroup component.
    module UI::CommandGroupBehavior
      def command_group_html_attributes
        attrs = {
          class: command_group_classes,
          data: command_group_data_attributes,
          role: "group"
        }
        attrs["aria-labelledby"] = @heading_id if @heading.present?
        attrs
      end

      def command_group_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          command_group_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def command_group_data_attributes
        {
          slot: "command-group",
          ui__command_target: "group"
        }
      end

      def command_group_heading_classes
        "px-2 py-1.5 text-xs font-medium text-muted-foreground"
      end

      private

      def command_group_base_classes
        "overflow-hidden p-1 text-foreground"
      end
    end
