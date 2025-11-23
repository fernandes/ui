# Toggle Component - ViewComponent

A two-state button that can be either on or off.

## Basic Usage

```ruby
<%= render UI::Toggle::ToggleComponent.new { "Toggle" } %>
```

## Component Path

- **Class**: `UI::Toggle::ToggleComponent`
- **File**: `app/components/ui/toggle/toggle_component.rb`
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
| `**attributes` | Hash | `{}` | Additional HTML attributes |

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

```ruby
<%= render UI::Toggle::ToggleComponent.new { "Toggle" } %>
```

### With Icon

```ruby
<%= render UI::Toggle::ToggleComponent.new(variant: :outline) do %>
  <svg class="h-4 w-4"><!-- bookmark icon --></svg>
<% end %>
```

### With Text and Icon

```ruby
<%= render UI::Toggle::ToggleComponent.new do %>
  <svg class="h-4 w-4"><!-- italic icon --></svg>
  <span>Italic</span>
<% end %>
```

### Pressed State

```ruby
<%= render UI::Toggle::ToggleComponent.new(pressed: true) do %>
  <svg class="h-4 w-4"><!-- bookmark icon --></svg>
<% end %>
```

### With Variant

```ruby
<%= render UI::Toggle::ToggleComponent.new(variant: :outline) { "Outline Toggle" } %>
```

### With Size

```ruby
<%= render UI::Toggle::ToggleComponent.new(size: :sm) { "Small" } %>
<%= render UI::Toggle::ToggleComponent.new(size: :lg) { "Large" } %>
```

### Disabled State

```ruby
<%= render UI::Toggle::ToggleComponent.new(disabled: true) do %>
  <svg class="h-4 w-4"><!-- underline icon --></svg>
<% end %>
```

### Custom Classes

```ruby
<%= render UI::Toggle::ToggleComponent.new(classes: "text-muted-foreground") do %>
  Custom
<% end %>
```

### With Additional Attributes

```ruby
<%= render UI::Toggle::ToggleComponent.new(
  variant: :outline,
  attributes: {
    "aria-label": "Toggle bookmark",
    id: "bookmark-toggle"
  }
) do %>
  <svg class="h-4 w-4"><!-- icon --></svg>
<% end %>
```

## Common Patterns

### Formatting Toolbar

```ruby
<div class="flex gap-1">
  <%= render UI::Toggle::ToggleComponent.new(
    variant: :outline,
    attributes: { "aria-label": "Toggle bold" }
  ) do %>
    <svg class="h-4 w-4"><!-- bold icon --></svg>
  <% end %>

  <%= render UI::Toggle::ToggleComponent.new(
    variant: :outline,
    attributes: { "aria-label": "Toggle italic" }
  ) do %>
    <svg class="h-4 w-4"><!-- italic icon --></svg>
  <% end %>

  <%= render UI::Toggle::ToggleComponent.new(
    variant: :outline,
    attributes: { "aria-label": "Toggle underline" }
  ) do %>
    <svg class="h-4 w-4"><!-- underline icon --></svg>
  <% end %>
</div>
```

### Bookmark Toggle

```ruby
<%= render UI::Toggle::ToggleComponent.new(
  variant: :outline,
  size: :sm,
  pressed: false,
  attributes: { "aria-label": "Toggle bookmark" }
) do %>
  <svg class="h-4 w-4"><!-- bookmark icon --></svg>
<% end %>
```

### With Label

```ruby
<div class="flex items-center gap-2">
  <%= render UI::Toggle::ToggleComponent.new(variant: :outline) do %>
    <svg class="h-4 w-4"><!-- italic icon --></svg>
  <% end %>
  <span class="text-sm">Enable italic text</span>
</div>
```

## Integration with Other Components

### In Toolbar

```ruby
<div class="flex items-center gap-1 rounded-md border p-1">
  <%= render UI::Toggle::ToggleComponent.new(variant: :default, size: :sm) do %>
    <svg><!-- icon --></svg>
  <% end %>

  <%= render UI::Toggle::ToggleComponent.new(variant: :default, size: :sm) do %>
    <svg><!-- icon --></svg>
  <% end %>
</div>
```

### With Stimulus Actions

```ruby
<%= render UI::Toggle::ToggleComponent.new(
  attributes: {
    "data-action": "ui--toggle:toggle->editor#toggleFormat",
    "data-format": "bold"
  }
) do %>
  <svg class="h-4 w-4"><!-- bold icon --></svg>
<% end %>
```

## Accessibility

The Toggle component includes proper ARIA attributes automatically:

- `aria-pressed` attribute reflects the pressed state
- Use `aria-label` for icon-only toggles
- Supports keyboard interaction (Space and Enter keys)

```ruby
<%= render UI::Toggle::ToggleComponent.new(
  variant: :outline,
  attributes: { "aria-label": "Toggle italic" }
) do %>
  <svg class="h-4 w-4"><!-- italic icon --></svg>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing nested ToggleComponent class

```ruby
<%= render UI::Toggle.new { "Text" } %>
# ERROR: undefined method 'new' for module UI::Toggle
```

### ✅ Correct: Use full path

```ruby
<%= render UI::Toggle::ToggleComponent.new { "Text" } %>  # Correct!
```

### ❌ Wrong: Passing content as parameter

```ruby
<%= render UI::Toggle::ToggleComponent.new(content: "Text") %>  # Won't work
```

### ✅ Correct: Content via block

```ruby
<%= render UI::Toggle::ToggleComponent.new { "Text" } %>  # Correct!
```

### ❌ Wrong: Invalid variant

```ruby
<%= render UI::Toggle::ToggleComponent.new(variant: :primary) %>  # Invalid variant
```

### ✅ Correct: Use valid variants

```ruby
<%= render UI::Toggle::ToggleComponent.new(variant: :default) %>  # or :outline
```
