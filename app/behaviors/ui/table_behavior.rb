# frozen_string_literal: true

    # TableBehavior
    #
    # Shared behavior for Table component across ERB, ViewComponent, and Phlex implementations.
    module UI::TableBehavior
      def render_table(&content_block)
        all_attributes = table_html_attributes.deep_merge(@attributes)
        content_tag(:table, **all_attributes, &content_block)
      end

      def table_html_attributes
        { class: table_classes }
      end

      def table_classes
        TailwindMerge::Merger.new.merge([
          table_base_classes,
          @classes
        ].compact.join(" "))
      end

      private

      def table_base_classes
        "w-full caption-bottom text-sm"
      end
    end
