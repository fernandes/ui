# frozen_string_literal: true

module UI
  module Table
    # HeaderBehavior
    #
    # Shared behavior for Table Header (thead) component.
    module HeaderBehavior
      def render_header(&content_block)
        all_attributes = header_html_attributes.deep_merge(@attributes)
        content_tag(:thead, **all_attributes, &content_block)
      end

      def header_html_attributes
        { class: header_classes }
      end

      def header_classes
        TailwindMerge::Merger.new.merge([
          header_base_classes,
          @classes
        ].compact.join(" "))
      end

      private

      def header_base_classes
        "[&_tr]:border-b"
      end
    end
  end
end
