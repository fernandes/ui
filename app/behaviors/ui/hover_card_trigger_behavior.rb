# frozen_string_literal: true

# Shared behavior for HoverCardTrigger component
# Provides HTML attributes and styling for the trigger element
# Supports asChild pattern for composition
module UI::HoverCardTriggerBehavior
  # Returns HTML attributes for the hover card trigger element
  def trigger_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: trigger_classes,
      data: trigger_data_attributes
    }.merge(attributes_value)
  end

  # Default trigger tag. Radix renders an <a>: a hover card usually previews
  # what a link points to, so pass `href:` and screen readers get a link.
  DEFAULT_TRIGGER_TAG = :a

  # Attributes for the default (non as_child) trigger element. A tag that
  # isn't focusable on its own (<span>, <div>, an <a> without href) gets
  # tabindex="0" so keyboard focus can open the card.
  def trigger_element_attributes(attrs, tag)
    attrs = attrs.dup
    focusable = (tag.to_sym == :a) ? attrs.key?(:href) : !%i[span div].include?(tag.to_sym)
    attrs[:tabindex] = "0" unless focusable || attrs.key?(:tabindex)
    attrs
  end

  # Returns combined CSS classes for the hover card trigger
  def trigger_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      trigger_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for the hover card trigger
  def trigger_data_attributes
    {
      ui__hover_card_target: "trigger",
      action: "mouseenter->ui--hover-card#show mouseleave->ui--hover-card#hide"
    }
  end

  private

  # Base classes applied to all hover card triggers
  # Includes inline-flex for alignment and focus ring for keyboard navigation
  def trigger_base_classes
    [
      "inline-flex",
      "rounded-sm",
      "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
    ].join(" ")
  end
end
