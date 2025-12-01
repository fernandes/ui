# frozen_string_literal: true

# UI::TableRowBehavior
#
# @ui_component Table Row
# @ui_category other
#
# @ui_anatomy Table Row - Table row element (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::TableRowBehavior
  def render_row(&content_block)
    all_attributes = row_html_attributes.deep_merge(@attributes)
    content_tag(:tr, **all_attributes, &content_block)
  end

  def row_html_attributes
    {class: row_classes}
  end

  def row_classes
    TailwindMerge::Merger.new.merge([
      row_base_classes,
      @classes
    ].compact.join(" "))
  end

  private

  def row_base_classes
    "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
  end
end
