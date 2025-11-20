# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Tooltip
    # TooltipContentBehavior
    #
    # Shared behavior for TooltipContent component.
    # The content is the popup that displays tooltip information.
    module TooltipContentBehavior
      # Returns HTML attributes for the tooltip content element
      def tooltip_content_html_attributes
        {
          class: tooltip_content_classes,
          data: tooltip_content_data_attributes
        }.compact
      end

      # Returns combined CSS classes for the tooltip content
      def tooltip_content_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          tooltip_content_base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the tooltip content
      def tooltip_content_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = (attributes_value&.fetch(:data, {}) || {})

        side_value = respond_to?(:side, true) ? side : @side
        align_value = respond_to?(:align, true) ? align : @align
        side_offset_value = respond_to?(:side_offset, true) ? side_offset : @side_offset

        base_data.merge({
          ui__tooltip_target: "content",
          state: "closed",
          side: side_value || "top",
          align: align_value || "center",
          ui__tooltip_side_offset_value: side_offset_value || 4
        }).compact
      end

      private

      # Base classes applied to all tooltip content (from shadcn/ui)
      def tooltip_content_base_classes
        "z-50 invisible overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md " \
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 " \
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 " \
        "data-[state=closed]:opacity-0 data-[state=open]:opacity-100 " \
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " \
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 " \
        "data-[state=open]:visible"
      end
    end
  end
end
