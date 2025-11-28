# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for AspectRatio component
    # Handles aspect ratio styling
    module UI::AspectRatioBehavior
      # Default aspect ratio is 1:1 (square)
      DEFAULT_RATIO = 1.0

      # Calculate padding-bottom percentage for aspect ratio
      # Formula: (height / width) * 100
      def aspect_ratio_padding
        ratio_value = @ratio || DEFAULT_RATIO
        percentage = (1.0 / ratio_value) * 100
        "#{percentage}%"
      end

      # Merge base classes with custom classes
      def aspect_ratio_classes
        TailwindMerge::Merger.new.merge([@classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for aspect ratio container
      def aspect_ratio_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          class: aspect_ratio_classes,
          "data-slot": "aspect-ratio",
          style: "position: relative; width: 100%;"
        )
      end

      # Build attributes for the padding element
      def aspect_ratio_padding_attributes
        {
          style: "padding-bottom: #{aspect_ratio_padding};"
        }
      end

      # Build attributes for the content wrapper
      def aspect_ratio_content_attributes
        {
          style: "position: absolute; top: 0; right: 0; bottom: 0; left: 0;"
        }
      end
    end
