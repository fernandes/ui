# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Alert Title component
    # Handles title styling
    module UI::AlertTitleBehavior
      # Base CSS classes for alert title
      def alert_title_base_classes
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight"
      end

      # Merge base classes with custom classes
      def alert_title_classes
        TailwindMerge::Merger.new.merge([alert_title_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for alert title
      def alert_title_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          class: alert_title_classes,
          "data-slot": "alert-title"
        )
      end

      # Renders the alert title HTML (for ERB partials)
      def render_alert_title(&content_block)
        all_attributes = alert_title_html_attributes.deep_merge(@attributes || {})
        content_tag(:div, **all_attributes, &content_block)
      end
    end
