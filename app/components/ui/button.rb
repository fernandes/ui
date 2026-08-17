# frozen_string_literal: true

# Button - Phlex implementation
#
# A versatile button component with multiple variants and sizes.
# Uses ButtonBehavior module for shared styling logic.
#
# @example Basic usage
#   render UI::Button.new { "Click me" }
#
# @example With variant and size
#   render UI::Button.new(variant: "destructive", size: "lg") { "Delete" }
#
# @example Disabled state
#   render UI::Button.new(disabled: true) { "Disabled" }
#
# @example As a link, with asChild
#   render UI::Button.new(variant: :outline, as_child: true) do |attrs|
#     link_to "Settings", settings_path, **attrs
#   end
class UI::Button < Phlex::HTML
  include UI::ButtonBehavior

  # @param variant [String] Visual style variant (default, destructive, outline, secondary, ghost, link)
  # @param size [String] Size variant (default, sm, lg, icon, icon-sm, icon-lg)
  # @param type [String] Button type attribute (button, submit, reset)
  # @param disabled [Boolean] Whether the button is disabled
  # @param as_child [Boolean] When true, yields attributes to the block instead
  #   of rendering a <button>, so a link or a form helper can carry the styling
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(variant: "default", size: "default", type: "button", disabled: false,
                 as_child: false, classes: "", **attributes)
    @variant = variant
    @size = size
    @type = type
    @disabled = disabled
    @as_child = as_child
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    if @as_child
      yield(as_child_attributes) if block_given?
    else
      button(**resolved_attributes, &block)
    end
  end

  private

  # Button styling merged with whatever the caller passed. TailwindMerge
  # resolves class conflicts so a caller can override padding or colour.
  def resolved_attributes
    attributes = button_html_attributes

    if @attributes.key?(:class)
      merged = TailwindMerge::Merger.new.merge(
        [ attributes[:class], @attributes[:class] ].compact.join(" ")
      )
      attributes = attributes.merge(class: merged)
    end

    attributes.deep_merge(@attributes.except(:class))
  end

  # When composing, the child element decides its own semantics: `type` belongs
  # to <button>, and `disabled` is not a valid attribute on an <a>. The styling
  # and any custom attributes are handed over; a disabled button becomes
  # aria-disabled so the intent survives on whatever element the block renders.
  def as_child_attributes
    attributes = resolved_attributes.except(:type, :disabled)
    return attributes unless @disabled

    attributes.deep_merge(aria: { disabled: "true" })
  end
end
