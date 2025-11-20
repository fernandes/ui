# frozen_string_literal: true
module UI
  module Item
    # ItemMediaBehavior
    #
    # Shared behavior for Item media container across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation and styling.
    module ItemMediaBehavior
      # Returns HTML attributes for the item media element
      def item_media_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        variant_value = respond_to?(:variant, true) ? variant : @variant
        {
          class: item_media_classes,
          "data-slot": "item-media",
          "data-variant": variant_value
        }.merge(attributes_value || {}).compact
      end

      # Returns combined CSS classes
      def item_media_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          item_media_base_classes,
          item_media_variant_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      # Base classes for item media (from shadcn/ui v4)
      def item_media_base_classes
        "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5"
      end

      # Variant-specific classes (from shadcn/ui v4)
      def item_media_variant_classes
        variant_value = respond_to?(:variant, true) ? variant : @variant
        case (variant_value || "default").to_s
        when "icon"
          "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4"
        when "image"
          "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover"
        else
          ""
        end
      end
    end
  end
end
