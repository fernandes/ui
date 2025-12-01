# frozen_string_literal: true

# UI::TableCaptionBehavior
#
# @ui_component Table Caption
# @ui_category other
#
# @ui_anatomy Table Caption - Caption text element (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::TableCaptionBehavior
  def render_caption(&content_block)
    all_attributes = caption_html_attributes.deep_merge(@attributes)
    content_tag(:caption, **all_attributes, &content_block)
  end

  def caption_html_attributes
    {class: caption_classes}
  end

  def caption_classes
    TailwindMerge::Merger.new.merge([
      caption_base_classes,
      @classes
    ].compact.join(" "))
  end

  private

  def caption_base_classes
    "mt-4 text-sm text-muted-foreground"
  end
end
