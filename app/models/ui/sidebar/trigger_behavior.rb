# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sidebar
    # TriggerBehavior
    #
    # Shared behavior for SidebarTrigger component.
    module TriggerBehavior
      def sidebar_trigger_html_attributes
        {
          class: sidebar_trigger_classes,
          data: sidebar_trigger_data_attributes
        }
      end

      def sidebar_trigger_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_trigger_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_trigger_data_attributes
        {
          slot: "sidebar-trigger",
          action: "click->ui--sidebar#toggle",
          ui__sidebar_target: "trigger"
        }
      end

      private

      def sidebar_trigger_base_classes
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium " \
        "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 " \
        "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 " \
        "hover:bg-accent hover:text-accent-foreground h-7 w-7"
      end
    end
  end
end
