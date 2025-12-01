# frozen_string_literal: true

# UI::CardBehavior
#
# @ui_component Card
# @ui_category layout
#
# @ui_anatomy Card - Root container for card (required)
# @ui_anatomy Action - Primary action button
# @ui_anatomy Content - Main content container (required)
# @ui_anatomy Description - Descriptive text element
# @ui_anatomy Footer - Footer section with actions
# @ui_anatomy Header - Header section with title and controls
# @ui_anatomy Title - Title text element
#
# @ui_feature Custom styling with Tailwind classes
#
# @ui_related dialog
#
module UI::CardBehavior
  def render_card(&content_block)
    all_attributes = card_html_attributes.deep_merge(@attributes)
    content_tag(:div, **all_attributes, &content_block)
  end

  def card_html_attributes
    {
      class: card_classes,
      data: {slot: "card"}
    }
  end

  def card_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      card_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  def card_base_classes
    "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
  end
end
