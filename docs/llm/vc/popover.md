# Popover (ViewComponent)

Displays rich content in a floating panel, triggered by a button.

## Component Paths

- **Root**: `UI::Popover::PopoverComponent`
- **Trigger**: `UI::Popover::TriggerComponent`
- **Content**: `UI::Popover::ContentComponent`

## Installation

The Popover component requires `@floating-ui/dom` for positioning:

```json
{
  "dependencies": {
    "@floating-ui/dom": "^1.7.4"
  }
}
```

## Basic Usage

```erb
<%= render UI::Popover::PopoverComponent.new do %>
  <%= render UI::Popover::TriggerComponent.new do %>
    <%= render UI::Button::ButtonComponent.new(variant: "outline") do %>
      Open popover
    <% end %>
  <% end %>
  <%= render UI::Popover::ContentComponent.new do %>
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Dimensions</h4>
        <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
      </div>
      <div class="grid gap-2">
        <div class="grid grid-cols-3 items-center gap-4">
          <%= render UI::Label::LabelComponent.new(for: "width") do %>Width<% end %>
          <%= render UI::Input::InputComponent.new(id: "width", value: "100%", classes: "col-span-2 h-8") %>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <%= render UI::Label::LabelComponent.new(for: "height") do %>Height<% end %>
          <%= render UI::Input::InputComponent.new(id: "height", value: "25px", classes: "col-span-2 h-8") %>
        </div>
      </div>
    </div>
  <% end %>
<% end %>
```

## Component Structure

### PopoverComponent (Root)

Container component that provides context for the popover.

**Parameters:**

- `placement` (String, default: `"bottom"`) - Position relative to trigger
  - Values: `"top"`, `"bottom"`, `"left"`, `"right"`, `"top-start"`, `"top-end"`, `"bottom-start"`, `"bottom-end"`, `"left-start"`, `"left-end"`, `"right-start"`, `"right-end"`
- `offset` (Integer, default: `4`) - Distance in pixels from trigger
- `trigger` (String, default: `"click"`) - Interaction type
  - Values: `"click"`, `"hover"`, `"manual"`
- `hover_delay` (Integer, default: `200`) - Delay in ms for hover trigger
- `align` (String, default: `nil`) - Legacy parameter for alignment
- `side_offset` (Integer, default: `nil`) - Alternative name for offset
- `classes` (String, default: `""`) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

**Example with custom placement:**

```erb
<%= render UI::Popover::PopoverComponent.new(placement: "top-start", offset: 8) do %>
  <%# ... trigger and content %>
<% end %>
```

### TriggerComponent

Button or element that triggers the popover.

**Parameters:**

- `as_child` (Boolean, default: `false`) - Pass attributes to child instead of wrapping
- `classes` (String, default: `""`) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

**Example with asChild:**

```erb
<%= render UI::Popover::TriggerComponent.new(as_child: true) do %>
  <%= render UI::Button::ButtonComponent.new(variant: "outline") do %>
    Open
  <% end %>
<% end %>
```

**Example without asChild (wraps content):**

```erb
<%= render UI::Popover::TriggerComponent.new do %>
  <button class="custom-button">Open</button>
<% end %>
```

### ContentComponent

The floating content panel.

**Parameters:**

- `side` (String, default: `"bottom"`) - Side of trigger to show content
  - Values: `"top"`, `"bottom"`, `"left"`, `"right"`
- `align` (String, default: `"center"`) - Alignment relative to trigger
  - Values: `"start"`, `"center"`, `"end"`
- `classes` (String, default: `""`) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

**Default styling:**
- Width: `w-72` (18rem / 288px)
- Can be overridden with `classes` parameter

**Example with custom width:**

```erb
<%= render UI::Popover::ContentComponent.new(classes: "w-80") do %>
  <%# Content %>
<% end %>
```

**Example with side and alignment:**

```erb
<%= render UI::Popover::ContentComponent.new(side: "top", align: "start") do %>
  <%# Content %>
<% end %>
```

## Common Patterns

### With Form Controls

```erb
<%= render UI::Popover::PopoverComponent.new do %>
  <%= render UI::Popover::TriggerComponent.new(as_child: true) do %>
    <%= render UI::Button::ButtonComponent.new(variant: "outline") do %>
      Settings
    <% end %>
  <% end %>
  <%= render UI::Popover::ContentComponent.new(classes: "w-80") do %>
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Settings</h4>
        <p class="text-sm text-muted-foreground">Configure your preferences.</p>
      </div>
      <div class="grid gap-2">
        <%# Form controls here %>
      </div>
    </div>
  <% end %>
<% end %>
```

### Hover Trigger

```erb
<%= render UI::Popover::PopoverComponent.new(trigger: "hover", hover_delay: 300) do %>
  <%= render UI::Popover::TriggerComponent.new do %>
    Hover over me
  <% end %>
  <%= render UI::Popover::ContentComponent.new do %>
    This appears on hover
  <% end %>
<% end %>
```

### Manual Control

```erb
<%# Trigger popover programmatically from JavaScript %>
<%= render UI::Popover::PopoverComponent.new(trigger: "manual", data: { popover_open_value: "false" }) do %>
  <%= render UI::Popover::TriggerComponent.new do %>
    <button data-action="click->my-controller#openPopover">Manual trigger</button>
  <% end %>
  <%= render UI::Popover::ContentComponent.new do %>
    Manually controlled content
  <% end %>
<% end %>
```

### With Icon Button Trigger

```erb
<%= render UI::Popover::PopoverComponent.new do %>
  <%= render UI::Popover::TriggerComponent.new(as_child: true) do %>
    <%= render UI::Button::ButtonComponent.new(variant: "ghost", size: "icon") do %>
      <svg class="w-4 h-4">...</svg>
    <% end %>
  <% end %>
  <%= render UI::Popover::ContentComponent.new do %>
    Content here
  <% end %>
<% end %>
```

## Accessibility

The component includes:

- Focus management with Escape key to close
- Click outside to dismiss
- Proper ARIA attributes via `data-state` attribute
- Keyboard navigation support

## Positioning

Uses Floating UI for smart positioning:

- Automatically flips when near viewport edges
- Shifts to stay within viewport
- Updates position on scroll/resize
- Supports all standard placements

## Animation

Content animates in/out using tw-animate-css:

- Fade in/out
- Zoom scale (95-100%)
- Slide direction based on `data-side` attribute

Animation is controlled via `data-state` attribute (managed by Stimulus controller).

## Error Prevention

**Common Mistakes:**

❌ **WRONG - Using module instead of component:**
```erb
<%= render UI::Popover.new %>  <%# Error: UI::Popover is a module %>
```

✅ **CORRECT - Use the component class:**
```erb
<%= render UI::Popover::PopoverComponent.new %>
```

❌ **WRONG - Missing trigger or content:**
```erb
<%= render UI::Popover::PopoverComponent.new do %>
  <%# Empty - needs trigger and content %>
<% end %>
```

✅ **CORRECT - Include both trigger and content:**
```erb
<%= render UI::Popover::PopoverComponent.new do %>
  <%= render UI::Popover::TriggerComponent.new do %>...<% end %>
  <%= render UI::Popover::ContentComponent.new do %>...<% end %>
<% end %>
```

## Related Components

- Button - Often used as trigger
- Label - For form fields within popover
- Input - For form controls
- Tooltip - For simpler hover content
