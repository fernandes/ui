# Toggle Group Component - ViewComponent

A set of two-state buttons that can be toggled on or off, supporting single and multiple selection modes.

## Basic Usage

```ruby
<%= render UI::ToggleGroup::ToggleGroupComponent.new(type: "single") do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "left") { "Left" } %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "center") { "Center" } %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "right") { "Right" } %>
<% end %>
```

## Component Paths

- **Group Class**: `UI::ToggleGroup::ToggleGroupComponent`
- **Item Class**: `UI::ToggleGroup::ItemComponent`
- **Files**:
  - `app/components/ui/toggle_group/toggle_group_component.rb`
  - `app/components/ui/toggle_group/item_component.rb`
- **Behavior Modules**:
  - `UI::ToggleGroupBehavior`
  - `UI::ToggleGroupItemBehavior`
- **Stimulus Controller**: `ui--toggle-group`

## ToggleGroupComponent Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | String | `"single"` | Selection mode: "single" or "multiple" |
| `variant` | String | `"default"` | Visual style (default, outline) |
| `size` | String | `"default"` | Size (default, sm, lg) |
| `value` | String/Array | `nil` | Current selected value(s) |
| `spacing` | Integer | `0` | Gap between items |
| `orientation` | String | `nil` | Layout direction |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## ItemComponent Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | String | Required | Unique identifier |
| `variant` | String | `nil` | Inherited from parent |
| `size` | String | `nil` | Inherited from parent |
| `pressed` | Boolean | `false` | Pressed state |
| `disabled` | Boolean | `false` | Disabled state |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Selection Modes

### Single Selection

```ruby
<%= render UI::ToggleGroup::ToggleGroupComponent.new(type: "single", value: "center") do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "left") do %>
    <%= lucide_icon("align-left") %>
  <% end %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "center") do %>
    <%= lucide_icon("align-center") %>
  <% end %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "right") do %>
    <%= lucide_icon("align-right") %>
  <% end %>
<% end %>
```

### Multiple Selection

```ruby
<%= render UI::ToggleGroup::ToggleGroupComponent.new(
  type: "multiple",
  value: ["bold", "italic"]
) do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "bold") { "Bold" } %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "italic") { "Italic" } %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "underline") { "Underline" } %>
<% end %>
```

## Variants

```ruby
# Default
<%= render UI::ToggleGroup::ToggleGroupComponent.new(variant: "default") do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "1") { "Item 1" } %>
<% end %>

# Outline (toolbar style)
<%= render UI::ToggleGroup::ToggleGroupComponent.new(variant: "outline") do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "1") { "Item 1" } %>
<% end %>
```

## Sizes

```ruby
# Small
<%= render UI::ToggleGroup::ToggleGroupComponent.new(size: "sm") do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "a") { "A" } %>
<% end %>

# Default
<%= render UI::ToggleGroup::ToggleGroupComponent.new(size: "default") do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "a") { "A" } %>
<% end %>

# Large
<%= render UI::ToggleGroup::ToggleGroupComponent.new(size: "lg") do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "a") { "A" } %>
<% end %>
```

## With Spacing

```ruby
<%= render UI::ToggleGroup::ToggleGroupComponent.new(
  spacing: 2,
  variant: "outline"
) do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "1") { "One" } %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "2") { "Two" } %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "3") { "Three" } %>
<% end %>
```

## Common Patterns

### Formatting Toolbar

```ruby
<%= render UI::ToggleGroup::ToggleGroupComponent.new(
  type: "multiple",
  variant: "outline"
) do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "bold") do %>
    <%= lucide_icon("bold") %>
  <% end %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "italic") do %>
    <%= lucide_icon("italic") %>
  <% end %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "underline") do %>
    <%= lucide_icon("underline") %>
  <% end %>
<% end %>
```

### Alignment Controls

```ruby
<%= render UI::ToggleGroup::ToggleGroupComponent.new(type: "single") do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "left") do %>
    <%= lucide_icon("align-left") %>
  <% end %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "center") do %>
    <%= lucide_icon("align-center") %>
  <% end %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "right") do %>
    <%= lucide_icon("align-right") %>
  <% end %>
<% end %>
```

## Accessibility

- **Single mode**: `role="radiogroup"` with `aria-checked`
- **Multiple mode**: `role="group"` with `aria-pressed`
- Full keyboard navigation support

## Error Prevention

### ❌ Wrong: Missing value

```ruby
<%= render UI::ToggleGroup::ItemComponent.new { "Text" } %>  # Missing required value
```

### ✅ Correct: Always provide value

```ruby
<%= render UI::ToggleGroup::ItemComponent.new(value: "unique-id") { "Text" } %>
```

### ❌ Wrong: Incorrect class path

```ruby
<%= render UI::ToggleGroup.new %>  # Missing ::ToggleGroupComponent
```

### ✅ Correct: Full class path

```ruby
<%= render UI::ToggleGroup::ToggleGroupComponent.new do %>
  <%= render UI::ToggleGroup::ItemComponent.new(value: "1") { "Item" } %>
<% end %>
```
