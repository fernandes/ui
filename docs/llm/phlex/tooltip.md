# Tooltip - Phlex

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Component Structure

The Tooltip component consists of three sub-components:
- `UI::Tooltip::Tooltip` - Root container
- `UI::Tooltip::Trigger` - Interactive element that shows/hides tooltip (supports asChild)
- `UI::Tooltip::Content` - Popup content

## Class Names

```ruby
UI::Tooltip::Tooltip       # Root container (Phlex)
UI::Tooltip::Trigger       # Trigger element (Phlex)
UI::Tooltip::Content       # Popup content (Phlex)
```

## Basic Usage

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Hover me" }
  render UI::Tooltip::Content.new { "Tooltip text" }
end
```

## Parameters

### Tooltip (Root)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Trigger

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Yield attributes to block instead of rendering button |
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Content

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `side` | String | `"top"` | Preferred side: "top", "right", "bottom", "left" |
| `align` | String | `"center"` | Alignment: "start", "center", "end" |
| `side_offset` | Integer | `4` | Distance from trigger in pixels |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Tooltip

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Hover me" }
  render UI::Tooltip::Content.new { "Add to library" }
end
```

### With asChild - Compose with Button

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new(as_child: true) do |attrs|
    render UI::Button::Button.new(**attrs, variant: :outline) do
      "Delete"
    end
  end
  render UI::Tooltip::Content.new { "Delete item" }
end
```

### With asChild - Custom Element

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new(as_child: true) do |attrs|
    span(**attrs, class: "cursor-help text-muted-foreground") do
      "?"
    end
  end
  render UI::Tooltip::Content.new(side: "right") do
    "Help information"
  end
end
```

### Different Sides

```ruby
# Top (default)
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Top" }
  render UI::Tooltip::Content.new { "Appears on top" }
end

# Right
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Right" }
  render UI::Tooltip::Content.new(side: "right") { "Appears on right" }
end

# Bottom
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Bottom" }
  render UI::Tooltip::Content.new(side: "bottom") { "Appears on bottom" }
end

# Left
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Left" }
  render UI::Tooltip::Content.new(side: "left") { "Appears on left" }
end
```

### With Icon Button

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new(as_child: true) do |attrs|
    render UI::Button::Button.new(**attrs, variant: :ghost, size: :icon) do
      # Icon SVG here
      plain "🔔"
    end
  end
  render UI::Tooltip::Content.new { "Notifications" }
end
```

### With Custom Offset

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Hover" }
  render UI::Tooltip::Content.new(side_offset: 12) do
    "More spacing from trigger"
  end
end
```

## Common Patterns

### Tooltip on Icon

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new(as_child: true) do |attrs|
    button(**attrs, class: "p-2 hover:bg-accent rounded-md") do
      # Icon
      plain "⚙️"
    end
  end
  render UI::Tooltip::Content.new { "Settings" }
end
```

### Tooltip on Link

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new(as_child: true) do |attrs|
    a(**attrs, href: "#", class: "text-primary underline") do
      "Learn more"
    end
  end
  render UI::Tooltip::Content.new(side: "top") do
    "Opens documentation"
  end
end
```

### Tooltip with Rich Content

```ruby
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Hover for details" }
  render UI::Tooltip::Content.new(classes: "max-w-xs") do
    div(class: "space-y-1") do
      p(class: "font-semibold") { "Title" }
      p(class: "text-xs") { "Longer description with multiple lines of text." }
    end
  end
end
```

## Error Prevention

### ❌ Common Mistakes

```ruby
# Wrong: Missing Trigger
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Content.new { "Text" }
end

# Wrong: Using UI::Tooltip directly (it's a module, not a component)
render UI::Tooltip.new { "Text" }

# Wrong: Not using splat operator with asChild
render UI::Tooltip::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(attrs) { "Button" }  # Missing **
end
```

### ✅ Correct Usage

```ruby
# Correct: Full structure
render UI::Tooltip::Tooltip.new do
  render UI::Tooltip::Trigger.new { "Trigger" }
  render UI::Tooltip::Content.new { "Content" }
end

# Correct: Correct module path
render UI::Tooltip::Tooltip.new

# Correct: Using splat operator
render UI::Tooltip::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs) { "Button" }
end
```

## Accessibility

- Content renders `role="tooltip"`; the controller gives it a per-instance id and adds it to the
  trigger's `aria-describedby` (an `aria-describedby` you set on the trigger is kept), so screen
  readers read the tooltip text as the trigger's description
- Keyboard focus shows the tooltip; the focus caused by a mouse click doesn't
- Escape closes it (only the topmost overlay, so a tooltip inside a dialog doesn't close the dialog)
- Hoverable (WCAG 1.4.13): the pointer can move from the trigger onto the tooltip without it closing
- Put essential information in the trigger's own label: the tooltip is a supplementary description
- Tooltip positioned to avoid viewport overflow

## Notes

- Content is attached to `document.body` for proper z-index layering
- Positioning handled by Floating UI via Stimulus controller
- Animations use `data-state` attribute with tw-animate-css
- The `asChild` pattern prevents wrapper div hell
- Supports keyboard navigation (Tab to focus, Escape to close)
