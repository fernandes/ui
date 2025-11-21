# frozen_string_literal: true

module UI
  module Command
    class Shortcut < Phlex::HTML
      include ShortcutBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        span(**command_shortcut_html_attributes.deep_merge(@attributes), &)
      end
    end
  end
end
