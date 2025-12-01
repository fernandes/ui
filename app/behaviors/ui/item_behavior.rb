# frozen_string_literal: true

# UI::ItemBehavior
#
# @ui_component Item
# @ui_category data-display
#
# @ui_anatomy Item - Individual item element (required)
# @ui_anatomy Content - Main content container (required)
# @ui_anatomy Description - Descriptive text element
# @ui_anatomy Footer - Footer section with actions
# @ui_anatomy Group - Container for grouping related items
# @ui_anatomy Header - Header section with title and controls
# @ui_anatomy Separator - Visual divider between sections
# @ui_anatomy Title - Title text element
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::ItemBehavior
  # Returns HTML attributes for the item container
  def item_html_attributes
    {
      class: item_classes,
      "data-slot": "item",
      "data-variant": @variant,
      "data-size": @size
    }.compact
  end

  # Returns combined CSS classes for the item
  def item_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      item_base_classes,
      item_variant_classes,
      item_size_classes,
      classes_value

    ].compact.join(" "))
  end

  # Returns HTML attributes for the media container
  def item_media_html_attributes
    {
      class: "shrink-0",
      data: {slot: "item-media"}
    }
  end

  # Returns HTML attributes for the content container
  def item_content_html_attributes
    {
      class: "min-w-0 flex-1"
    }
  end

  # Returns HTML attributes for the content text
  def item_content_text_html_attributes
    {
      class: "font-medium",
      data: {slot: "item-content"}
    }
  end

  # Returns HTML attributes for the description
  def item_description_html_attributes
    {
      class: "text-muted-foreground text-sm",
      data: {slot: "item-description"}
    }
  end

  # Returns HTML attributes for the actions container
  def item_actions_html_attributes
    {
      class: "shrink-0",
      data: {slot: "item-actions"}
    }
  end

  private

  # Base classes applied to all items (from shadcn/ui v4)
  def item_base_classes
    "group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
  end

  # Variant-specific classes (from shadcn/ui v4)
  def item_variant_classes
    case (@variant || "default").to_s
    when "default"
      "bg-transparent"
    when "outline"
      "border-border"
    when "muted"
      "bg-muted/50"
    else
      "bg-transparent"
    end
  end

  # Size-specific classes (from shadcn/ui v4)
  def item_size_classes
    case (@size || "default").to_s
    when "sm"
      "py-3 px-4 gap-2.5"
    when "default"
      "p-4 gap-4"
    else
      "p-4 gap-4"
    end
  end
end
