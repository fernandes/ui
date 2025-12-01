# frozen_string_literal: true

# Avatar Fallback - ViewComponent implementation
#
# Displays fallback content when the image hasn't loaded or fails to load.
class UI::AvatarFallbackComponent < ViewComponent::Base
  include UI::AvatarFallbackBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.span(**avatar_fallback_html_attributes.deep_merge(@attributes)) do
      content
    end
  end
end
