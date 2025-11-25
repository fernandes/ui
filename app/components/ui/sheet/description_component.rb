# frozen_string_literal: true

module UI
  module Sheet
    # Sheet description component (ViewComponent)
    #
    # @example
    #   <%= render UI::Sheet::DescriptionComponent.new { "Make changes to your profile here." } %>
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
