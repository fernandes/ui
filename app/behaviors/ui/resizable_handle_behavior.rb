# frozen_string_literal: true

# Shared behavior for ResizableHandle component
# Handles data attributes for resize handles
module UI::ResizableHandleBehavior
  # Base CSS classes for the handle
  # The handle uses a thin visual line (w-px) but has padding for easier interaction
  def handle_base_classes
    base = [
      "relative z-10 flex shrink-0 items-center justify-center",
      "w-2 -mx-[3.5px]", # 8px wide handle with negative margin to overlap panels
      "bg-transparent cursor-col-resize",
      "touch-none select-none", # Prevent scroll interference on touch devices
      # The visible line is drawn with ::after
      "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
      # Vertical direction
      "data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full",
      "data-[panel-group-direction=vertical]:-my-[3.5px] data-[panel-group-direction=vertical]:mx-0",
      "data-[panel-group-direction=vertical]:cursor-row-resize",
      "data-[panel-group-direction=vertical]:after:inset-x-0 data-[panel-group-direction=vertical]:after:inset-y-auto",
      "data-[panel-group-direction=vertical]:after:top-1/2 data-[panel-group-direction=vertical]:after:left-0",
      "data-[panel-group-direction=vertical]:after:h-px data-[panel-group-direction=vertical]:after:w-full",
      "data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90"
    ]
    base << @classes if @classes.present?
    base.join(" ")
  end

  # Generate data attributes for the handle
  def handle_data_attributes
    {
      ui__resizable_target: "handle",
      resize_handle: "",
      resize_handle_state: "inactive"
    }
  end

  # Merge user-provided data attributes with handle data
  def merged_handle_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(handle_data_attributes)
  end

  # Stimulus actions for the handle
  def handle_actions
    [
      "pointerdown->ui--resizable#startDrag",
      "pointerenter->ui--resizable#handleEnter",
      "pointerleave->ui--resizable#handleLeave",
      "focus->ui--resizable#handleFocus",
      "blur->ui--resizable#handleBlur"
    ].join(" ")
  end

  # Build complete HTML attributes hash for handle
  def handle_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    data_attrs = merged_handle_data_attributes
    data_attrs[:action] = handle_actions

    base_attrs.merge(
      class: handle_base_classes,
      "data-slot": "resizable-handle",
      tabindex: "0",
      role: "separator",
      "aria-valuenow": "50",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      data: data_attrs
    )
  end

  # CSS classes for the grip icon container (when with_handle is true)
  def grip_container_classes
    [
      "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border"
    ].join(" ")
  end
end
