# frozen_string_literal: true

# AvatarImageBehavior
#
# Shared behavior for AvatarImage component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation for avatar images.
#
# Based on shadcn/ui Avatar: https://ui.shadcn.com/docs/components/avatar
# Based on Radix UI Avatar: https://www.radix-ui.com/primitives/docs/components/avatar
module UI::AvatarImageBehavior
  # Returns HTML attributes for the avatar image element
  def avatar_image_html_attributes
    {
      src: @src,
      alt: @alt,
      class: avatar_image_classes,
      data: avatar_image_data_attributes
    }
  end

  # Returns combined CSS classes for the avatar image
  def avatar_image_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      avatar_image_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus target
  def avatar_image_data_attributes
    {
      "ui--avatar_target": "image",
      slot: "avatar-image"
    }
  end

  private

  # Base classes applied to all avatar images
  # Matches shadcn/ui v4: "aspect-square size-full"
  # Start hidden until image loads successfully
  def avatar_image_base_classes
    "aspect-square size-full hidden"
  end
end
