# frozen_string_literal: true

# ActionBehavior
#
# Shared behavior for CardAction component across ERB, ViewComponent, and Phlex implementations.
module UI::CardActionBehavior
  def render_card_action(&content_block)
    all_attributes = card_action_html_attributes.deep_merge(@attributes)
    content_tag(:div, **all_attributes, &content_block)
  end

  def card_action_html_attributes
    {
      class: card_action_classes,
      data: {slot: "card-action"}
    }
  end

  def card_action_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      card_action_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  def card_action_base_classes
    "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
  end
end
