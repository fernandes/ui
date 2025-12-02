# frozen_string_literal: true

# UI::EmptyBehavior
#
# @ui_component Empty
# @ui_description Empty - Phlex implementation
# @ui_category data-display
#
# @ui_anatomy Empty - Displays empty states in applications with customizable media, titles, descriptions, and actions. (required)
# @ui_anatomy Content - Displays the content of the empty state such as a button, input or a link. (required)
# @ui_anatomy Description - Displays the description of the empty state.
# @ui_anatomy Header - Wraps the empty media, title, and description.
# @ui_anatomy Title - Displays the title of the empty state.
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::EmptyBehavior
  def empty_html_attributes
    {
      class: empty_classes,
      data: {slot: "empty"}
    }
  end

  def empty_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
      classes_value
    ].compact.join(" "))
  end
end

# EmptyHeaderBehavior - Shared behavior for EmptyHeader sub-component
module UI::EmptyHeaderBehavior
  def empty_header_html_attributes
    {
      class: empty_header_classes,
      data: {slot: "empty-header"}
    }
  end

  def empty_header_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "flex max-w-sm flex-col items-center gap-2 text-center",
      classes_value
    ].compact.join(" "))
  end
end

# EmptyMediaBehavior - Shared behavior for EmptyMedia sub-component
module UI::EmptyMediaBehavior
  def empty_media_html_attributes
    {
      class: empty_media_classes,
      data: {slot: "empty-media"}
    }
  end

  def empty_media_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    variant_value = @variant.to_s

    TailwindMerge::Merger.new.merge([
      "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      empty_media_variant_classes(variant_value),
      classes_value
    ].compact.join(" "))
  end

  private

  def empty_media_variant_classes(variant)
    case variant
    when "icon"
      "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6"
    else # "default"
      "bg-transparent"
    end
  end
end

# EmptyTitleBehavior - Shared behavior for EmptyTitle sub-component
module UI::EmptyTitleBehavior
  def empty_title_html_attributes
    {
      class: empty_title_classes,
      data: {slot: "empty-title"}
    }
  end

  def empty_title_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "font-semibold tracking-tight text-base",
      classes_value
    ].compact.join(" "))
  end
end

# EmptyDescriptionBehavior - Shared behavior for EmptyDescription sub-component
module UI::EmptyDescriptionBehavior
  def empty_description_html_attributes
    {
      class: empty_description_classes,
      data: {slot: "empty-description"}
    }
  end

  def empty_description_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "text-sm text-muted-foreground",
      classes_value
    ].compact.join(" "))
  end
end

# EmptyContentBehavior - Shared behavior for EmptyContent sub-component
module UI::EmptyContentBehavior
  def empty_content_html_attributes
    {
      class: empty_content_classes,
      data: {slot: "empty-content"}
    }
  end

  def empty_content_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      classes_value
    ].compact.join(" "))
  end
end
