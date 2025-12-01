# frozen_string_literal: true

# DescriptionBehavior
#
# Shared behavior for CardDescription component across ERB, ViewComponent, and Phlex implementations.
module UI::CardDescriptionBehavior
  def render_card_description(&content_block)
    all_attributes = card_description_html_attributes.deep_merge(@attributes)
    content_tag(:div, **all_attributes, &content_block)
  end

  def card_description_html_attributes
    {
      class: card_description_classes,
      data: {slot: "card-description"}
    }
  end

  def card_description_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      card_description_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  def card_description_base_classes
    "text-muted-foreground text-sm"
  end
end
