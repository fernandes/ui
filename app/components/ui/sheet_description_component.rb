# frozen_string_literal: true

    # Sheet description component (ViewComponent)
    #
    # @example
    #   <%= render UI::DescriptionComponent.new { "Make changes to your profile here." } %>
    class UI::SheetDescriptionComponent < ViewComponent::Base
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
