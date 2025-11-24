# Progress Component - ViewComponent

Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.

## Component Path

```ruby
UI::Progress::ProgressComponent
```

## Parameters

- `value` (Numeric, default: 0) - Progress value between 0 and 100
- `classes` (String, default: "") - Additional CSS classes
- `attributes` (Hash, default: {}) - Additional HTML attributes

## Basic Usage

**IMPORTANT:** ViewComponent requires parentheses when passing a block!

```erb
<%# Simple progress bar %>
<%= render UI::Progress::ProgressComponent.new(value: 60) %>

<%# Custom height %>
<%= render UI::Progress::ProgressComponent.new(value: 75, classes: "h-4") %>

<%# With custom styling %>
<%= render UI::Progress::ProgressComponent.new(value: 33, classes: "w-3/5 h-3") %>
```

## Dynamic Progress Example

```erb
<div class="space-y-4">
  <%= render UI::Progress::ProgressComponent.new(value: @upload_progress) %>

  <p class="text-sm text-muted-foreground">
    <%= @upload_progress %>% complete
  </p>
</div>
```

## Loading States

```erb
<%# Indeterminate (no value) %>
<%= render UI::Progress::ProgressComponent.new %>

<%# Starting state %>
<%= render UI::Progress::ProgressComponent.new(value: 0) %>

<%# Complete %>
<%= render UI::Progress::ProgressComponent.new(value: 100) %>
```

## Accessibility

The component automatically includes proper ARIA attributes:
- `role="progressbar"`
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-valuenow` - Set to current value

## Common Mistakes

❌ **WRONG** - Using module instead of component class:
```erb
<%= render UI::Progress.new(value: 50) %>
```

✅ **CORRECT** - Using full component class path:
```erb
<%= render UI::Progress::ProgressComponent.new(value: 50) %>
```

❌ **WRONG** - Value outside 0-100 range (will be clamped):
```erb
<%= render UI::Progress::ProgressComponent.new(value: 150) %>  <%# Displayed as 100 %>
```

✅ **CORRECT** - Value within range:
```erb
<%= render UI::Progress::ProgressComponent.new(value: 75) %>
```
