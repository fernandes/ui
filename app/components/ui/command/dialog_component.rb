# frozen_string_literal: true

module UI
  module Command
    class DialogComponent < ViewComponent::Base
      include DialogBehavior

      def initialize(shortcut: "meta+j", classes: "", **attributes)
        @shortcut = shortcut
        @classes = classes
        @attributes = attributes
      end
    end
  end
end
