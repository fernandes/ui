# frozen_string_literal: true

# Avatar Image - Phlex implementation
#
# Displays the avatar image. Only renders when it has loaded successfully.
# Uses AvatarImageBehavior module for shared styling logic.
#
# Based on shadcn/ui Avatar: https://ui.shadcn.com/docs/components/avatar
# Based on Radix UI Avatar: https://www.radix-ui.com/primitives/docs/components/avatar
#
# @example Basic usage
#   render UI::Image.new(
#     src: "https://github.com/shadcn.png",
#     alt: "User avatar"
#   )
class UI::AvatarImage < Phlex::HTML
  include UI::AvatarImageBehavior

  # @param src [String] Image source URL
  # @param alt [String] Alternative text for the image
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(src:, alt: "", classes: "", **attributes)
    @src = src
    @alt = alt
    @classes = classes
    @attributes = attributes
  end

  def view_template
    img(**avatar_image_html_attributes.deep_merge(@attributes))
  end
end
