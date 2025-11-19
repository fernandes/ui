# frozen_string_literal: true

module UI
  module Avatar
    # AvatarFallbackBehavior
    #
    # Shared behavior for AvatarFallback component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation for avatar fallbacks.
    #
    # Based on shadcn/ui Avatar: https://ui.shadcn.com/docs/components/avatar
    # Based on Radix UI Avatar: https://www.radix-ui.com/primitives/docs/components/avatar
    module AvatarFallbackBehavior
      # Returns HTML attributes for the avatar fallback element
      def avatar_fallback_html_attributes
        {
          class: avatar_fallback_classes,
          data: avatar_fallback_data_attributes
        }
      end

      # Returns combined CSS classes for the avatar fallback
      def avatar_fallback_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          avatar_fallback_base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus target
      def avatar_fallback_data_attributes
        {
          "ui--avatar_target": "fallback",
          slot: "avatar-fallback"
        }
      end

      private

      # Base classes applied to all avatar fallbacks
      # Matches shadcn/ui v4: "bg-muted flex size-full items-center justify-center rounded-full"
      def avatar_fallback_base_classes
        "bg-muted flex size-full items-center justify-center rounded-full"
      end
    end
  end
end
