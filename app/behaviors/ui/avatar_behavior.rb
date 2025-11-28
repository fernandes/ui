# frozen_string_literal: true

    # AvatarBehavior
    #
    # Shared behavior for Avatar component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation.
    #
    # Based on shadcn/ui Avatar: https://ui.shadcn.com/docs/components/avatar
    # Based on Radix UI Avatar: https://www.radix-ui.com/primitives/docs/components/avatar
    module UI::AvatarBehavior
      # Returns HTML attributes for the avatar element
      def avatar_html_attributes
        {
          class: avatar_classes,
          data: avatar_data_attributes
        }
      end

      # Returns combined CSS classes for the avatar
      def avatar_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          avatar_base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus controller
      def avatar_data_attributes
        {
          controller: "ui--avatar",
          slot: "avatar"
        }
      end

      private

      # Base classes applied to all avatars
      # Matches shadcn/ui v4: "relative flex size-8 shrink-0 overflow-hidden rounded-full"
      def avatar_base_classes
        "relative flex size-8 shrink-0 overflow-hidden rounded-full"
      end
    end
