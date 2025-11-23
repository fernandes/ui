# Toggle Component - ERB

A two-state button that can be either on or off.

## Basic Usage

```erb
<%= render "ui/toggle/toggle" do %>
  Toggle
<% end %>
```

## Component Path

- **Partial**: `ui/toggle/toggle`
- **File**: `app/views/ui/toggle/_toggle.html.erb`
- **Behavior Module**: `UI::ToggleBehavior`
- **Stimulus Controller**: `ui--toggle`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | String/Symbol | `"default"` | Visual style variant |
| `size` | String/Symbol | `"default"` | Size variant |
| `type` | String | `"button"` | HTML button type attribute |
| `pressed` | Boolean | `false` | Whether toggle is pressed/active |
| `disabled` | Boolean | `false` | Whether toggle is disabled |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Variants

- `default` - Transparent background (default)
- `outline` - Bordered variant with shadow

## Sizes

- `default` - Default size (h-9 px-2 min-w-9)
- `sm` - Small size (h-8 px-1.5 min-w-8)
- `lg` - Large size (h-10 px-2.5 min-w-10)

## State Management

The Toggle component automatically manages its pressed state via Stimulus controller:

- **Data Attributes**:
  - `data-state="on"` - When pressed/active
  - `data-state="off"` - When not pressed
  - `data-disabled` - Present when disabled
- **ARIA**: `aria-pressed="true|false"` for accessibility

## Examples

### Basic Toggle

```erb
<%= render "ui/toggle/toggle" do %>
  Toggle
<% end %>
```

### With Icon

```erb
<%= render "ui/toggle/toggle", variant: :outline do %>
  <svg class="h-4 w-4"><!-- bookmark icon --></svg>
<% end %>
```

### With Text and Icon

```erb
<%= render "ui/toggle/toggle" do %>
  <svg class="h-4 w-4"><!-- italic icon --></svg>
  <span>Italic</span>
<% end %>
```

### Pressed State

```erb
<%= render "ui/toggle/toggle", pressed: true do %>
  <svg class="h-4 w-4"><!-- bookmark icon --></svg>
<% end %>
```

### With Variant

```erb
<%= render "ui/toggle/toggle", variant: :outline do %>
  Outline Toggle
<% end %>
```

### With Size

```erb
<%= render "ui/toggle/toggle", size: :sm do %>
  Small
<% end %>

<%= render "ui/toggle/toggle", size: :lg do %>
  Large
<% end %>
```

### Disabled State

```erb
<%= render "ui/toggle/toggle", disabled: true do %>
  <svg class="h-4 w-4"><!-- underline icon --></svg>
<% end %>
```

### Custom Classes

```erb
<%= render "ui/toggle/toggle", classes: "text-muted-foreground" do %>
  Custom
<% end %>
```

### With Additional Attributes

```erb
<%= render "ui/toggle/toggle",
  variant: :outline,
  attributes: { "aria-label": "Toggle bookmark", id: "bookmark-toggle" } do %>
  <svg class="h-4 w-4"><!-- icon --></svg>
<% end %>
```

## Common Patterns

### Formatting Toolbar

```erb
<div class="flex gap-1">
  <%= render "ui/toggle/toggle",
    variant: :outline,
    attributes: { "aria-label": "Toggle bold" } do %>
    <svg class="h-4 w-4"><!-- bold icon --></svg>
  <% end %>

  <%= render "ui/toggle/toggle",
    variant: :outline,
    attributes: { "aria-label": "Toggle italic" } do %>
    <svg class="h-4 w-4"><!-- italic icon --></svg>
  <% end %>

  <%= render "ui/toggle/toggle",
    variant: :outline,
    attributes: { "aria-label": "Toggle underline" } do %>
    <svg class="h-4 w-4"><!-- underline icon --></svg>
  <% end %>
</div>
```

### Bookmark Toggle

```erb
<%= render "ui/toggle/toggle",
  variant: :outline,
  size: :sm,
  pressed: false,
  attributes: { "aria-label": "Toggle bookmark" } do %>
  <svg class="h-4 w-4"><!-- bookmark icon --></svg>
<% end %>
```

### With Label

```erb
<div class="flex items-center gap-2">
  <%= render "ui/toggle/toggle", variant: :outline do %>
    <svg class="h-4 w-4"><!-- italic icon --></svg>
  <% end %>
  <span class="text-sm">Enable italic text</span>
</div>
```

## Integration with Other Components

### In Toolbar

```erb
<div class="flex items-center gap-1 rounded-md border p-1">
  <%= render "ui/toggle/toggle", variant: :default, size: :sm do %>
    <svg><!-- icon --></svg>
  <% end %>

  <%= render "ui/toggle/toggle", variant: :default, size: :sm do %>
    <svg><!-- icon --></svg>
  <% end %>
</div>
```

### With Stimulus Actions

```erb
<%= render "ui/toggle/toggle",
  attributes: {
    "data-action": "ui--toggle:toggle->editor#toggleFormat",
    "data-format": "bold"
  } do %>
  <svg class="h-4 w-4"><!-- bold icon --></svg>
<% end %>
```

## Accessibility

The Toggle component includes proper ARIA attributes automatically:

- `aria-pressed` attribute reflects the pressed state
- Use `aria-label` for icon-only toggles
- Supports keyboard interaction (Space and Enter keys)

```erb
<%= render "ui/toggle/toggle",
  variant: :outline,
  attributes: { "aria-label": "Toggle italic" } do %>
  <svg class="h-4 w-4"><!-- italic icon --></svg>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing do/end block

```erb
<%= render "ui/toggle/toggle", content: "Text" %>  # Won't work
```

### ✅ Correct: Content via block

```erb
<%= render "ui/toggle/toggle" do %>
  Text
<% end %>
```

### ❌ Wrong: Invalid variant

```erb
<%= render "ui/toggle/toggle", variant: :primary do %>
  Text
<% end %>
```

### ✅ Correct: Use valid variants

```erb
<%= render "ui/toggle/toggle", variant: :default do %>
  Text
<% end %>
# or variant: :outline
```

### ❌ Wrong: Incorrect partial path

```erb
<%= render "ui/toggle" %>  # Missing file name
```

### ✅ Correct: Full partial path

```erb
<%= render "ui/toggle/toggle" do %>  # Correct!
  Text
<% end %>
```
