# frozen_string_literal: true

    # HeadBehavior
    #
    # Shared behavior for Table Head (th) component.
    module UI::TableHeadBehavior
      def render_head(&content_block)
        all_attributes = head_html_attributes.deep_merge(@attributes)
        content_tag(:th, **all_attributes, &content_block)
      end

      def head_html_attributes
        { class: head_classes }
      end

      def head_classes
        TailwindMerge::Merger.new.merge([
          head_base_classes,
          @classes
        ].compact.join(" "))
      end

      private

      def head_base_classes
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
      end
    end
