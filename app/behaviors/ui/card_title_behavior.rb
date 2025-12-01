# frozen_string_literal: true

# TitleBehavior
#
# Shared behavior for CardTitle component across ERB, ViewComponent, and Phlex implementations.
module UI::CardTitleBehavior
  def render_card_title(&content_block)
    all_attributes = card_title_html_attributes.deep_merge(@attributes)
    content_tag(:div, **all_attributes, &content_block)
  end

  def card_title_html_attributes
    {
      class: card_title_classes,
      data: {slot: "card-title"}
    }
  end

  def card_title_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      card_title_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  def card_title_base_classes
    "leading-none font-semibold"
  end
end
