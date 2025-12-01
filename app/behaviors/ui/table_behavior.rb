# frozen_string_literal: true

# UI::TableBehavior
#
# @ui_component Table
# @ui_category data-display
#
# @ui_anatomy Table - Root container for table (required)
# @ui_anatomy Footer - Footer section with actions
# @ui_anatomy Header - Header section with title and controls
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::TableBehavior
  def render_table(&content_block)
    all_attributes = table_html_attributes.deep_merge(@attributes)
    content_tag(:table, **all_attributes, &content_block)
  end

  def table_html_attributes
    {class: table_classes}
  end

  def table_classes
    TailwindMerge::Merger.new.merge([
      table_base_classes,
      @classes
    ].compact.join(" "))
  end

  private

  def table_base_classes
    "w-full caption-bottom text-sm"
  end
end
