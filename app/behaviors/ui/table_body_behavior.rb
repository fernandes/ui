# frozen_string_literal: true

# UI::TableBodyBehavior
#
# @ui_component Table Body
# @ui_category other
#
# @ui_anatomy Table Body - Main body content area (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::TableBodyBehavior
  def render_body(&content_block)
    all_attributes = body_html_attributes.deep_merge(@attributes)
    content_tag(:tbody, **all_attributes, &content_block)
  end

  def body_html_attributes
    {class: body_classes}
  end

  def body_classes
    TailwindMerge::Merger.new.merge([
      body_base_classes,
      @classes
    ].compact.join(" "))
  end

  private

  def body_base_classes
    "[&_tr:last-child]:border-0"
  end
end
