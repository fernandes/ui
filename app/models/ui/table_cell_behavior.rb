# frozen_string_literal: true

    # CellBehavior
    #
    # Shared behavior for Table Cell (td) component.
    module UI::TableCellBehavior
      def render_cell(&content_block)
        all_attributes = cell_html_attributes.deep_merge(@attributes)
        content_tag(:td, **all_attributes, &content_block)
      end

      def cell_html_attributes
        { class: cell_classes }
      end

      def cell_classes
        TailwindMerge::Merger.new.merge([
          cell_base_classes,
          @classes
        ].compact.join(" "))
      end

      private

      def cell_base_classes
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
      end
    end
