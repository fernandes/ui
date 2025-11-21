# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Command
    # ShortcutBehavior
    #
    # Shared behavior for CommandShortcut component.
    module ShortcutBehavior
      def command_shortcut_html_attributes
        {
          class: command_shortcut_classes,
          data: { slot: "command-shortcut" }
        }
      end

      def command_shortcut_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          command_shortcut_base_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      def command_shortcut_base_classes
        "ml-auto text-xs tracking-widest text-muted-foreground"
      end
    end
  end
end
