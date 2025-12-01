# frozen_string_literal: true

# Shared behavior for ResizablePanelGroup container component
# Handles Stimulus controller setup and data attributes
module UI::ResizablePanelGroupBehavior
  # Generate Stimulus controller data attributes
  def panel_group_data_attributes
    {
      controller: "ui--resizable",
      ui__resizable_direction_value: @direction || "horizontal",
      ui__resizable_keyboard_resize_by_value: @keyboard_resize_by || 10
    }
  end

  # Merge user-provided data attributes with panel group controller data
  def merged_panel_group_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(panel_group_data_attributes)
  end

  # Base CSS classes for the panel group container
  def panel_group_base_classes
    classes = [
      "flex h-full w-full overflow-hidden",
      (@direction == "vertical") ? "flex-col" : "flex-row"
    ]
    classes << @classes if @classes.present?
    classes.join(" ")
  end

  # Build complete HTML attributes hash for panel group container
  def panel_group_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: panel_group_base_classes,
      "data-panel-group-direction": @direction || "horizontal",
      "data-slot": "resizable-panel-group",
      data: merged_panel_group_data_attributes
    )
  end
end
