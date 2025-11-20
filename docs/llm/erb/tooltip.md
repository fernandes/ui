# Tooltip - ERB

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Component Structure

The Tooltip component consists of three partials:
- `ui/tooltip/tooltip` - Root container
- `ui/tooltip/trigger` - Interactive element that shows/hides tooltip (supports asChild)
- `ui/tooltip/content` - Popup content

## Partial Paths

```erb
<%= render "ui/tooltip/tooltip" %>      <%# Root container %>
<%= render "ui/tooltip/trigger" %>      <%# Trigger element %>
<%= render "ui/tooltip/content" %>      <%# Popup content %>
```

## Basic Usage

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>
    Hover me
  <% end %>
  <%= render "ui/tooltip/content" do %>
    Tooltip text
  <% end %>
<% end %>
```

## Parameters

### Tooltip (Root)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Trigger

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Inject attributes into block's first element |
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

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>
    Hover me
  <% end %>
  <%= render "ui/tooltip/content" do %>
    Add to library
  <% end %>
<% end %>
```

### With asChild - Compose with Button

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger", as_child: true do %>
    <%= render "ui/button/button", variant: :outline do %>
      Delete
    <% end %>
  <% end %>
  <%= render "ui/tooltip/content" do %>
    Delete item
  <% end %>
<% end %>
```

### With asChild - Custom Element

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger", as_child: true do %>
    <span class="cursor-help text-muted-foreground">?</span>
  <% end %>
  <%= render "ui/tooltip/content", side: "right" do %>
    Help information
  <% end %>
<% end %>
```

### Different Sides

```erb
<%# Top (default) %>
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>Top<% end %>
  <%= render "ui/tooltip/content" do %>Appears on top<% end %>
<% end %>

<%# Right %>
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>Right<% end %>
  <%= render "ui/tooltip/content", side: "right" do %>
    Appears on right
  <% end %>
<% end %>

<%# Bottom %>
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>Bottom<% end %>
  <%= render "ui/tooltip/content", side: "bottom" do %>
    Appears on bottom
  <% end %>
<% end %>

<%# Left %>
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>Left<% end %>
  <%= render "ui/tooltip/content", side: "left" do %>
    Appears on left
  <% end %>
<% end %>
```

### With Icon Button

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger", as_child: true do %>
    <%= render "ui/button/button", variant: :ghost, size: :icon do %>
      🔔
    <% end %>
  <% end %>
  <%= render "ui/tooltip/content" do %>
    Notifications
  <% end %>
<% end %>
```

### With Custom Offset

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>Hover<% end %>
  <%= render "ui/tooltip/content", side_offset: 12 do %>
    More spacing from trigger
  <% end %>
<% end %>
```

## Common Patterns

### Tooltip on Icon

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger", as_child: true do %>
    <button class="p-2 hover:bg-accent rounded-md">⚙️</button>
  <% end %>
  <%= render "ui/tooltip/content" do %>
    Settings
  <% end %>
<% end %>
```

### Tooltip on Link

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger", as_child: true do %>
    <a href="#" class="text-primary underline">Learn more</a>
  <% end %>
  <%= render "ui/tooltip/content", side: "top" do %>
    Opens documentation
  <% end %>
<% end %>
```

### Tooltip with Rich Content

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>
    Hover for details
  <% end %>
  <%= render "ui/tooltip/content", classes: "max-w-xs" do %>
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
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/content" do %>Text<% end %>
<% end %>

<%# Wrong: Incorrect partial path %>
<%= render "ui/tooltip" do %>
  Content
<% end %>

<%# Wrong: Using render without "ui/tooltip/tooltip" %>
<%= render UI::Tooltip::Tooltip.new %>  <%# This is Phlex syntax %>
```

### ✅ Correct Usage

```erb
<%# Correct: Full structure %>
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/trigger" do %>Trigger<% end %>
  <%= render "ui/tooltip/content" do %>Content<% end %>
<% end %>

<%# Correct: Correct partial paths %>
<%= render "ui/tooltip/tooltip" %>
<%= render "ui/tooltip/trigger" %>
<%= render "ui/tooltip/content" %>
```

## Accessibility

- Automatically adds proper ARIA attributes
- Keyboard accessible (focus shows tooltip)
- ESC key closes tooltip
- Mouse hover shows/hides tooltip
- Tooltip positioned to avoid viewport overflow

## Notes

- Content is attached to `document.body` for proper z-index layering
- Positioning handled by Floating UI via Stimulus controller
- Animations use `data-state` attribute with tw-animate-css
- The `asChild` pattern injects attributes into the first HTML element in the block
- Supports keyboard navigation (Tab to focus, Escape to close)
- When using `as_child: true`, attributes are automatically injected into your custom element
