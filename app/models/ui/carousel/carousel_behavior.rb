# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Carousel
    # Shared behavior for Carousel root component
    module CarouselBehavior
      # Base CSS classes for carousel container
      def carousel_base_classes
        "relative"
      end

      # Merge base classes with custom classes
      def carousel_classes
        TailwindMerge::Merger.new.merge([carousel_base_classes, @classes].compact.join(" "))
      end

      # Data attributes for Stimulus controller
      def carousel_data_attributes
        attrs = {
          controller: "ui--carousel",
          ui__carousel_orientation_value: @orientation || "horizontal"
        }

        # Add options if provided
        if @opts
          attrs[:ui__carousel_opts_value] = @opts.to_json
        end

        # Add plugins if provided
        if @plugins
          attrs[:ui__carousel_plugins_value] = @plugins.to_json
        end

        attrs
      end

      # Merge user-provided data attributes
      def merged_carousel_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(carousel_data_attributes)
      end

      # Build complete HTML attributes hash
      def carousel_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: carousel_classes,
          role: "region",
          "aria-roledescription": "carousel",
          data: merged_carousel_data_attributes
        )
      end
    end
  end
end
