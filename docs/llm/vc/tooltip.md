# Tooltip - ViewComponent

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Component Structure

The Tooltip component consists of three ViewComponents:
- `UI::Tooltip::TooltipComponent` - Root container
- `UI::Tooltip::TriggerComponent` - Interactive element that shows/hides tooltip
- `UI::Tooltip::ContentComponent` - Popup content

## Class Names

```ruby
UI::Tooltip::TooltipComponent       # Root container (ViewComponent)
UI::Tooltip::TriggerComponent       # Trigger element (ViewComponent)
UI::Tooltip::ContentComponent       # Popup content (ViewComponent)
```

## Basic Usage

```erb
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>
    Hover me
  <% end %>
  <%= render UI::Tooltip::ContentComponent.new do %>
    Tooltip text
  <% end %>
<% end %>
```

## Parameters

### TooltipComponent (Root)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `attributes` | Hash | `{}` | Additional HTML attributes |

### TriggerComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Yield attributes to block (limited support) |
| `attributes` | Hash | `{}` | Additional HTML attributes |

### ContentComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `side` | String | `"top"` | Preferred side: "top", "right", "bottom", "left" |
| `align` | String | `"center"` | Alignment: "start", "center", "end" |
| `side_offset` | Integer | `4` | Distance from trigger in pixels |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Tooltip

```erb
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>
    Hover me
  <% end %>
  <%= render UI::Tooltip::ContentComponent.new do %>
    Add to library
  <% end %>
<% end %>
```

### With Button Trigger

```erb
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>
    <%= render UI::Button::ButtonComponent.new(variant: :outline) do %>
      Delete
    <% end %>
  <% end %>
  <%= render UI::Tooltip::ContentComponent.new do %>
    Delete item
  <% end %>
<% end %>
```

### Different Sides

```erb
<%# Top (default) %>
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>Top<% end %>
  <%= render UI::Tooltip::ContentComponent.new do %>
    Appears on top
  <% end %>
<% end %>

<%# Right %>
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>Right<% end %>
  <%= render UI::Tooltip::ContentComponent.new(side: "right") do %>
    Appears on right
  <% end %>
<% end %>

<%# Bottom %>
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>Bottom<% end %>
  <%= render UI::Tooltip::ContentComponent.new(side: "bottom") do %>
    Appears on bottom
  <% end %>
<% end %>

<%# Left %>
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>Left<% end %>
  <%= render UI::Tooltip::ContentComponent.new(side: "left") do %>
    Appears on left
  <% end %>
<% end %>
```

### With Icon Button

```erb
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>
    <%= render UI::Button::ButtonComponent.new(variant: :ghost, size: :icon) do %>
      🔔
    <% end %>
  <% end %>
  <%= render UI::Tooltip::ContentComponent.new do %>
    Notifications
  <% end %>
<% end %>
```

### With Custom Offset

```erb
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>Hover<% end %>
  <%= render UI::Tooltip::ContentComponent.new(side_offset: 12) do %>
    More spacing from trigger
  <% end %>
<% end %>
```

## Common Patterns

### Tooltip on Icon

```erb
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>
    <button class="p-2 hover:bg-accent rounded-md">⚙️</button>
  <% end %>
  <%= render UI::Tooltip::ContentComponent.new do %>
    Settings
  <% end %>
<% end %>
```

### Tooltip on Link

```erb
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>
    <a href="#" class="text-primary underline">Learn more</a>
  <% end %>
  <%= render UI::Tooltip::ContentComponent.new(side: "top") do %>
    Opens documentation
  <% end %>
<% end %>
```

### Tooltip with Rich Content

```erb
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>
    Hover for details
  <% end %>
  <%= render UI::Tooltip::ContentComponent.new(classes: "max-w-xs") do %>
    <div class="space-y-1">
      <p class="font-semibold">Title</p>
      <p class="text-xs">Longer description with multiple lines of text.</p>
    </div>
  <% end %>
<% end %>
```

## Error Prevention

### ❌ Common Mistakes

```erb
<%# Wrong: Missing Trigger %>
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::ContentComponent.new do %>Text<% end %>
<% end %>

<%# Wrong: Using UI::Tooltip (it's a module, not a component) %>
<%= render UI::Tooltip.new %>

<%# Wrong: Incorrect component class %>
<%= render UI::TooltipComponent.new %>
```

### ✅ Correct Usage

```erb
<%# Correct: Full structure %>
<%= render UI::Tooltip::TooltipComponent.new do %>
  <%= render UI::Tooltip::TriggerComponent.new do %>Trigger<% end %>
  <%= render UI::Tooltip::ContentComponent.new do %>Content<% end %>
<% end %>

<%# Correct: Correct module path %>
<%= render UI::Tooltip::TooltipComponent.new %>
<%= render UI::Tooltip::TriggerComponent.new %>
<%= render UI::Tooltip::ContentComponent.new %>
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
- ViewComponent has limited `asChild` support compared to Phlex
- Supports keyboard navigation (Tab to focus, Escape to close)
- For advanced composition, consider using Phlex or ERB partials
