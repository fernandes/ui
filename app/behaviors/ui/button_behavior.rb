# frozen_string_literal: true

require "tailwind_merge"

# UI::ButtonBehavior
#
# @ui_component Button
# @ui_description Button - Phlex implementation
# @ui_category forms
#
# @ui_anatomy Button - A versatile button component with multiple variants and sizes. (required)
# @ui_anatomy Group - A container that groups related buttons together with consistent styling.
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Disabled state support
# @ui_feature ARIA attributes for accessibility
#
# @ui_aria_pattern Button
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/button/
#
# @ui_related toggle
#
module UI::ButtonBehavior
  # Renders the button HTML
  # This method can be used by both ERB partials and ViewComponents
  # @param content_block [Proc] Block that returns the button content
  # @return [String] HTML string for the button
  def render_button(&content_block)
    all_attributes = button_html_attributes

    # Merge classes with TailwindMerge before deep_merge
    if @attributes&.key?(:class)
      button_class = all_attributes[:class] || ""
      attr_class = @attributes[:class] || ""
      merged_class = TailwindMerge::Merger.new.merge([button_class, attr_class].join(" "))
      all_attributes = all_attributes.merge(class: merged_class)
    end

    # Deep merge other attributes (excluding class which we already handled)
    all_attributes = all_attributes.deep_merge(@attributes&.except(:class) || {})

    content_tag(:button, **all_attributes, &content_block)
  end

  # Returns HTML attributes for the button element
  def button_html_attributes
    {
      class: button_classes,
      type: @type || "button",
      disabled: @disabled ? true : nil
    }.compact
  end

  # Returns combined CSS classes for the button
  def button_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      button_base_classes,
      button_variant_classes,
      button_size_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes applied to all buttons
  def button_base_classes
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius,0.5rem)] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg]:px-3"
  end

  # Variant-specific classes based on @variant
  def button_variant_classes
    case @variant.to_s
    when "default"
      "bg-primary text-primary-foreground hover:bg-primary/90"
    when "destructive"
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
    when "outline"
      "!border !border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50"
    when "secondary"
      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    when "ghost"
      "hover:bg-accent hover:text-accent-foreground"
    when "link"
      "text-primary underline-offset-4 hover:underline"
    else
      "bg-primary text-primary-foreground hover:bg-primary/90"
    end
  end

  # Size-specific classes based on @size
  def button_size_classes
    case @size.to_s
    when "default"
      "h-9 px-4 py-2"
    when "sm"
      "h-8 px-3 text-xs"
    when "lg"
      "h-10 px-8"
    when "icon"
      "h-9 w-9"
    when "icon-sm"
      "h-8 w-8"
    when "icon-lg"
      "h-10 w-10"
    else
      "h-9 px-4 py-2"
    end
  end
end
