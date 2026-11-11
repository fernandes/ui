# frozen_string_literal: true

require "tailwind_merge"

# UI::ResponsiveDialogBehavior
#
# @ui_component Responsive Dialog
# @ui_description ResponsiveDialog - Renders Dialog on desktop, Drawer on mobile Uses hybrid CSS + Stimulus approach for responsive switching at 768px (md breakpoint)
# @ui_category other
#
# @ui_anatomy Responsive Dialog - Root container with state management (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Focus management
# @ui_feature Animation support
#
module UI::ResponsiveDialogBehavior
  # Generate data attributes for Stimulus controller
  def responsive_dialog_data_attributes
    {
      controller: "ui--responsive-dialog",
      ui__responsive_dialog_open_value: @open,
      ui__responsive_dialog_breakpoint_value: @breakpoint || 768
    }
  end

  # Merge user-provided data attributes
  def merged_responsive_dialog_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(responsive_dialog_data_attributes)
  end

  # Build complete HTML attributes hash
  def responsive_dialog_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: responsive_dialog_classes,
      data: merged_responsive_dialog_data_attributes
    )
  end

  # The caller's body, rendered once inside the Dialog; the controller moves
  # it into the Drawer below the breakpoint (no duplicated ids).
  # `contents` keeps its children laid out by the content's grid/flex.
  def responsive_dialog_body_attributes
    {class: "contents", data: {ui__responsive_dialog_target: "body"}}
  end

  # Where the body goes in each variant's content (:drawer or :dialog)
  def responsive_dialog_slot_attributes(type)
    {class: "contents", data: {ui__responsive_dialog_target: "#{type}Slot"}}
  end

  # Wrapper that shows a variant only on its side of the breakpoint
  def responsive_dialog_variant_attributes(type)
    {
      class: (type == :drawer) ? "md:hidden" : "hidden md:block",
      data: {ui__responsive_dialog_target: type.to_s}
    }
  end

  # Base CSS classes
  def responsive_dialog_base_classes
    ""
  end

  # Generate final classes using TailwindMerge
  def responsive_dialog_classes
    UI::ClassMerger.merge([responsive_dialog_base_classes, @classes].compact.join(" "))
  end
end
