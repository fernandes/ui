# Popover (Phlex)

Displays rich content in a floating panel, triggered by a button.

## Component Paths

- **Root**: `UI::Popover::Popover`
- **Trigger**: `UI::Popover::Trigger`
- **Content**: `UI::Popover::Content`

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

```ruby
render UI::Popover::Popover.new do
  render UI::Popover::Trigger.new do
    render UI::Button::Button.new(variant: "outline") { "Open popover" }
  end
  render UI::Popover::Content.new do
    div(class: "grid gap-4") do
      div(class: "space-y-2") do
        h4(class: "font-medium leading-none") { "Dimensions" }
        p(class: "text-sm text-muted-foreground") { "Set the dimensions for the layer." }
      end
      div(class: "grid gap-2") do
        div(class: "grid grid-cols-3 items-center gap-4") do
          render UI::Label::Label.new(for: "width") { "Width" }
          render UI::Input::Input.new(
            id: "width",
            value: "100%",
            classes: "col-span-2 h-8"
          )
        end
        div(class: "grid grid-cols-3 items-center gap-4") do
          render UI::Label::Label.new(for: "height") { "Height" }
          render UI::Input::Input.new(
            id: "height",
            value: "25px",
            classes: "col-span-2 h-8"
          )
        end
      end
    end
  end
end
```

## Component Structure

### Popover (Root)

Container component that provides context for the popover.

**Parameters:**

- `placement` (String, default: `"bottom"`) - Position relative to trigger
  - Values: `"top"`, `"bottom"`, `"left"`, `"right"`, `"top-start"`, `"top-end"`, `"bottom-start"`, `"bottom-end"`, `"left-start"`, `"left-end"`, `"right-start"`, `"right-end"`
- `offset` (Integer, default: `4`) - Distance in pixels from trigger
- `trigger` (String, default: `"click"`) - Interaction type
  - Values: `"click"`, `"hover"`, `"manual"`
- `hover_delay` (Integer, default: `200`) - Delay in ms for hover trigger
- `classes` (String, default: `""`) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

**Example with custom placement:**

```ruby
render UI::Popover::Popover.new(placement: "top-start", offset: 8) do
  # ... trigger and content
end
```

### Trigger

Button or element that triggers the popover.

**Parameters:**

- `as_child` (Boolean, default: `false`) - Pass attributes to child instead of wrapping
- `classes` (String, default: `""`) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

**Example with asChild:**

```ruby
render UI::Popover::Trigger.new(as_child: true) do
  render UI::Button::Button.new(variant: "outline") { "Open" }
end
```

**Example without asChild (wraps content):**

```ruby
render UI::Popover::Trigger.new do
  button(class: "custom-button") { "Open" }
end
```

### Content

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

```ruby
render UI::Popover::Content.new(classes: "w-80") do
  # Content
end
```

**Example with side and alignment:**

```ruby
render UI::Popover::Content.new(side: "top", align: "start") do
  # Content
end
```

## Common Patterns

### With Form Controls

```ruby
render UI::Popover::Popover.new do
  render UI::Popover::Trigger.new(as_child: true) do
    render UI::Button::Button.new(variant: "outline") { "Settings" }
  end
  render UI::Popover::Content.new(classes: "w-80") do
    div(class: "grid gap-4") do
      div(class: "space-y-2") do
        h4(class: "font-medium leading-none") { "Settings" }
        p(class: "text-sm text-muted-foreground") { "Configure your preferences." }
      end
      div(class: "grid gap-2") do
        # Form controls here
      end
    end
  end
end
```

### Hover Trigger

```ruby
render UI::Popover::Popover.new(trigger: "hover", hover_delay: 300) do
  render UI::Popover::Trigger.new do
    plain "Hover over me"
  end
  render UI::Popover::Content.new do
    plain "This appears on hover"
  end
end
```

### Manual Control

```ruby
# Trigger popover programmatically from JavaScript
render UI::Popover::Popover.new(trigger: "manual", data: { popover_open_value: "false" }) do
  render UI::Popover::Trigger.new do
    button(data: { action: "click->my-controller#openPopover" }) { "Manual trigger" }
  end
  render UI::Popover::Content.new do
    plain "Manually controlled content"
  end
end
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
```ruby
render UI::Popover.new  # Error: UI::Popover is a module
```

✅ **CORRECT - Use the component class:**
```ruby
render UI::Popover::Popover.new
```

❌ **WRONG - Missing trigger or content:**
```ruby
render UI::Popover::Popover.new do
  # Empty - needs trigger and content
end
```

✅ **CORRECT - Include both trigger and content:**
```ruby
render UI::Popover::Popover.new do
  render UI::Popover::Trigger.new { "..." }
  render UI::Popover::Content.new { "..." }
end
```

## Related Components

- Button - Often used as trigger
- Label - For form fields within popover
- Input - For form controls
- Tooltip - For simpler hover content
