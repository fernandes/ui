# frozen_string_literal: true

module UI
  module Sonner
    # Shared behavior for Sonner Toaster component
    # Provides HTML attributes for the toaster container
    module ToasterBehavior
      POSITIONS = %w[top-left top-center top-right bottom-left bottom-center bottom-right].freeze
      THEMES = %w[light dark system].freeze

      def toaster_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: toaster_classes,
          data: toaster_data_attributes
        )
      end

      def toaster_data_attributes
        base_data = @attributes&.dig(:data) || {}
        {
          controller: "ui--sonner",
          ui__sonner_position_value: @position,
          ui__sonner_theme_value: @theme,
          ui__sonner_rich_colors_value: @rich_colors,
          ui__sonner_expand_value: @expand,
          ui__sonner_duration_value: @duration,
          ui__sonner_close_button_value: @close_button,
          ui__sonner_visible_toasts_value: @visible_toasts
        }.compact.merge(base_data)
      end

      def toaster_classes
        TailwindMerge::Merger.new.merge(["toaster group", @classes].compact.join(" "))
      end
    end
  end
end
