# frozen_string_literal: true

module UI
  module Dialog
    # Dialog description component (ViewComponent)
    # Description text for the dialog
    #
    # @example
    #   <%= render UI::Dialog::DescriptionComponent.new { "Dialog description" } %>
    class DescriptionComponent < ViewComponent::Base
      # @param classes [String] additional CSS classes
      def initialize(classes: "")
        @classes = classes
      end

      def call
        content_tag :p, content, class: description_classes
      end

      private

      def description_classes
        TailwindMerge::Merger.new.merge([
          "text-muted-foreground text-sm",
          @classes
        ].compact.join(" "))
      end
    end
  end
end
