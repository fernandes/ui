# frozen_string_literal: true

# UI::SonnerToasterBehavior
#
# @ui_component Sonner Toaster
# @ui_description Sonner Toaster component (Phlex) Container for toast notifications - render once in your layout
# @ui_category other
#
# @ui_anatomy Sonner Toaster - Sonner Toaster component part (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Toasts announced through a polite live region (errors assertive)
#
# @ui_keyboard F8 Moves focus to the notifications region
# @ui_keyboard Escape Dismisses the focused toast
#
module UI::SonnerToasterBehavior
  POSITIONS = %w[top-left top-center top-right bottom-left bottom-center bottom-right].freeze
  THEMES = %w[light dark system].freeze
  HOTKEY = "F8"

  # The landmark around the toast list (Radix / Base UI ToastViewport): a
  # labelled region, reachable with F8, that is also the polite live region.
  # It is rendered with the page so it already exists when the first toast
  # is inserted - otherwise screen readers miss the announcement.
  def toaster_region_attributes
    {
      role: "region",
      tabindex: "-1",
      aria: {
        label: toaster_region_label,
        live: "polite",
        relevant: "additions text",
        atomic: "false"
      },
      data: {sonner_region: ""}
    }
  end

  # Visually hidden container for the assertive (role="alert") copies of
  # error toasts
  def toaster_alerts_attributes
    {class: "sr-only", data: {sonner_alerts: ""}}
  end

  def toaster_region_label
    "#{@label.presence || "Notifications"} (#{HOTKEY})"
  end

  def toaster_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: toaster_classes,
      data: toaster_data_attributes
    )
  end

  def toaster_data_attributes
    base_data = @attributes&.dig(:data) || {}
    {
      controller: "ui--sonner",
      ui__sonner_position_value: @position,
      ui__sonner_theme_value: @theme,
      ui__sonner_rich_colors_value: @rich_colors,
      ui__sonner_expand_value: @expand,
      ui__sonner_duration_value: @duration,
      ui__sonner_close_button_value: @close_button,
      ui__sonner_visible_toasts_value: @visible_toasts
    }.compact.merge(base_data)
  end

  def toaster_classes
    UI::ClassMerger.merge(["toaster group", @classes].compact.join(" "))
  end
end
