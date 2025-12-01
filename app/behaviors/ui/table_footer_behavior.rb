# frozen_string_literal: true

# FooterBehavior
#
# Shared behavior for Table Footer (tfoot) component.
module UI::TableFooterBehavior
  def render_footer(&content_block)
    all_attributes = footer_html_attributes.deep_merge(@attributes)
    content_tag(:tfoot, **all_attributes, &content_block)
  end

  def footer_html_attributes
    {class: footer_classes}
  end

  def footer_classes
    TailwindMerge::Merger.new.merge([
      footer_base_classes,
      @classes
    ].compact.join(" "))
  end

  private

  def footer_base_classes
    "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0"
  end
end
