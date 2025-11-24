# Progress Component - ERB

Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.

## Basic Usage

```erb
<%# Simple progress bar %>
<%= render "ui/progress/progress", value: 60 %>

<%# Custom height %>
<%= render "ui/progress/progress", value: 75, classes: "h-4" %>

<%# With custom styling %>
<%= render "ui/progress/progress", value: 33, classes: "w-3/5 h-3" %>
```

## Dynamic Progress Example

```erb
<div class="space-y-4">
  <%= render "ui/progress/progress", value: @upload_progress %>

  <p class="text-sm text-muted-foreground">
    <%= @upload_progress %>% complete
  </p>
</div>
```

## Loading States

```erb
<%# Indeterminate (no value) %>
<%= render "ui/progress/progress" %>

<%# Starting state %>
<%= render "ui/progress/progress", value: 0 %>

<%# Complete %>
<%= render "ui/progress/progress", value: 100 %>
```

## Parameters

- `value` (Numeric, default: 0) - Progress value between 0 and 100
- `classes` (String, default: "") - Additional CSS classes
- `attributes` (Hash, default: {}) - Additional HTML attributes

## Accessibility

The component automatically includes proper ARIA attributes:
- `role="progressbar"`
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-valuenow` - Set to current value

## Common Mistakes

❌ **WRONG** - Using component path instead of partial:
```erb
<%= render UI::Progress::Progress.new(value: 50) %>
```

✅ **CORRECT** - Using partial path:
```erb
<%= render "ui/progress/progress", value: 50 %>
```
