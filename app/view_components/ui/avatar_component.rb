# frozen_string_literal: true

# Avatar - ViewComponent implementation
#
# Displays an image element with a fallback for representing users.
class UI::AvatarComponent < ViewComponent::Base
  include UI::AvatarBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.span(**avatar_html_attributes.deep_merge(@attributes)) do
      content
    end
  end
end
