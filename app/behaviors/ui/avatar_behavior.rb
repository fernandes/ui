# frozen_string_literal: true

# UI::AvatarBehavior
#
# @ui_component Avatar
# @ui_description Avatar - Phlex implementation
# @ui_category data-display
#
# @ui_anatomy Avatar - Displays an image element with a fallback for representing users. (required)
# @ui_anatomy Fallback - Displays fallback content when the image hasn't loaded or fails to load.
# @ui_anatomy Image - Displays the avatar image. Only renders when it has loaded successfully.
#
# @ui_feature Custom styling with Tailwind classes
#
# @ui_related badge
#
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
