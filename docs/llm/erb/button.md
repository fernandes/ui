# Button Component - ERB

Interactive button component with multiple style variants and sizes.

## Basic Usage

```erb
<%= render "ui/button", content: "Click me" %>
```

## Component Path

- **Partial**: `ui/button`
- **File**: `app/views/ui/_button.html.erb`
- **Behavior Module**: `UI::ButtonBehavior`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | String | `nil` | Button text content |
| `variant` | String/Symbol | `"default"` | Visual style variant |
| `size` | String/Symbol | `"default"` | Size variant |
| `type` | String | `"button"` | HTML button type attribute |
| `disabled` | Boolean | `false` | Whether button is disabled |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Variants

- `default` - Primary button style (default)
- `destructive` - Destructive action (delete, remove)
- `outline` - Outlined button
- `secondary` - Secondary button
- `ghost` - Minimal ghost button
- `link` - Link-styled button

## Sizes

- `default` - Default size (h-9 px-4 py-2)
- `sm` - Small size (h-8 px-3 text-xs)
- `lg` - Large size (h-10 px-8)
- `icon` - Icon-only square (h-9 w-9)
- `icon-sm` - Small icon (h-8 w-8)
- `icon-lg` - Large icon (h-10 w-10)

## Examples

### Basic Button

```erb
<%= render "ui/button", content: "Click me" %>
```

### With Variant

```erb
<%= render "ui/button", variant: :destructive, content: "Delete" %>
<%= render "ui/button", variant: :outline, content: "Cancel" %>
<%= render "ui/button", variant: :ghost, content: "Skip" %>
```

### With Size

```erb
<%= render "ui/button", size: :sm, content: "Small" %>
<%= render "ui/button", size: :lg, content: "Large" %>
```

### Disabled State

```erb
<%= render "ui/button", disabled: true, content: "Disabled" %>
```

### Custom Classes

```erb
<%= render "ui/button", classes: "w-full", content: "Full Width" %>
```

### Submit Button

```erb
<%= render "ui/button", type: "submit", content: "Submit Form" %>
```

### With Additional Attributes

```erb
<%= render "ui/button", attributes: { id: "my-button", "data-action": "click->handler#submit" }, content: "Submit" %>
```

### Icon Button (using block)

```erb
<%= render "ui/button", variant: :ghost, size: :icon do %>
  <svg><!-- icon SVG --></svg>
<% end %>
```

### Complex Content (using block)

```erb
<%= render "ui/button", variant: :outline do %>
  <svg class="mr-2 h-4 w-4"><!-- icon --></svg>
  <span>Button with Icon</span>
<% end %>
```

## Content: Two Ways

You can pass content either as a parameter OR as a block:

```erb
<%# Approach 1: content parameter %>
<%= render "ui/button", content: "Click me" %>

<%# Approach 2: block (useful for HTML content) %>
<%= render "ui/button" do %>
  Click me
<% end %>
```

## Common Patterns

### Form Submit Button

```erb
<%= render "ui/button", type: "submit", variant: :default, content: "Save Changes" %>
```

### Cancel Button

```erb
<%= render "ui/button", variant: :outline, content: "Cancel" %>
```

### Delete Button

```erb
<%= render "ui/button", variant: :destructive, content: "Delete Account" %>
```

### Loading State

```erb
<%= render "ui/button", disabled: true do %>
  <svg class="mr-2 h-4 w-4 animate-spin"><!-- spinner icon --></svg>
  Loading...
<% end %>
```

## Integration with Other Components

### Inside Alert Dialog

```erb
<%= render "ui/alert_dialog/alert_dialog_trigger" do %>
  <%= render "ui/button", content: "Open Dialog" %>
<% end %>
```

### With Stimulus Actions

```erb
<%= render "ui/button", attributes: { "data-action": "click->modal#open" }, content: "Open Modal" %>
```

## Error Prevention

### ❌ Wrong: Using Phlex syntax

```erb
<%= render UI::Button::Button.new { "Text" } %>  # Wrong - this is Phlex
```

### ✅ Correct: Use string path

```erb
<%= render "ui/button", content: "Text" %>  # Correct!
```
