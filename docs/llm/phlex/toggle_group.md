# Toggle Group Component - Phlex

A set of two-state buttons that can be toggled on or off, supporting single and multiple selection modes.

## Basic Usage

```ruby
render UI::ToggleGroup::ToggleGroup.new(type: "single") do
  render UI::ToggleGroup::Item.new(value: "left") { "Left" }
  render UI::ToggleGroup::Item.new(value: "center") { "Center" }
  render UI::ToggleGroup::Item.new(value: "right") { "Right" }
end
```

## Component Paths

- **Group Class**: `UI::ToggleGroup::ToggleGroup`
- **Item Class**: `UI::ToggleGroup::Item`
- **Files**:
  - `app/components/ui/toggle_group/toggle_group.rb`
  - `app/components/ui/toggle_group/item.rb`
- **Behavior Modules**:
  - `UI::ToggleGroupBehavior`
  - `UI::ToggleGroupItemBehavior`
- **Stimulus Controller**: `ui--toggle-group`

## ToggleGroup Parameters

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

## Item Parameters

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
render UI::ToggleGroup::ToggleGroup.new(type: "single", value: "center") do
  render UI::ToggleGroup::Item.new(value: "left") do
    lucide_icon("align-left")
  end
  render UI::ToggleGroup::Item.new(value: "center") do
    lucide_icon("align-center")
  end
  render UI::ToggleGroup::Item.new(value: "right") do
    lucide_icon("align-right")
  end
end
```

### Multiple Selection

```ruby
render UI::ToggleGroup::ToggleGroup.new(
  type: "multiple",
  value: ["bold", "italic"]
) do
  render UI::ToggleGroup::Item.new(value: "bold") { "Bold" }
  render UI::ToggleGroup::Item.new(value: "italic") { "Italic" }
  render UI::ToggleGroup::Item.new(value: "underline") { "Underline" }
end
```

## Variants

```ruby
# Default
render UI::ToggleGroup::ToggleGroup.new(variant: "default") do
  render UI::ToggleGroup::Item.new(value: "1") { "Item 1" }
end

# Outline (toolbar style)
render UI::ToggleGroup::ToggleGroup.new(variant: "outline") do
  render UI::ToggleGroup::Item.new(value: "1") { "Item 1" }
end
```

## Sizes

```ruby
# Small
render UI::ToggleGroup::ToggleGroup.new(size: "sm") do
  render UI::ToggleGroup::Item.new(value: "a") { "A" }
end

# Default
render UI::ToggleGroup::ToggleGroup.new(size: "default") do
  render UI::ToggleGroup::Item.new(value: "a") { "A" }
end

# Large
render UI::ToggleGroup::ToggleGroup.new(size: "lg") do
  render UI::ToggleGroup::Item.new(value: "a") { "A" }
end
```

## With Spacing

```ruby
render UI::ToggleGroup::ToggleGroup.new(
  spacing: 2,
  variant: "outline"
) do
  render UI::ToggleGroup::Item.new(value: "1") { "One" }
  render UI::ToggleGroup::Item.new(value: "2") { "Two" }
  render UI::ToggleGroup::Item.new(value: "3") { "Three" }
end
```

## Common Patterns

### Formatting Toolbar

```ruby
render UI::ToggleGroup::ToggleGroup.new(
  type: "multiple",
  variant: "outline"
) do
  render UI::ToggleGroup::Item.new(value: "bold") do
    lucide_icon("bold")
  end
  render UI::ToggleGroup::Item.new(value: "italic") do
    lucide_icon("italic")
  end
  render UI::ToggleGroup::Item.new(value: "underline") do
    lucide_icon("underline")
  end
end
```

### Alignment Controls

```ruby
render UI::ToggleGroup::ToggleGroup.new(type: "single") do
  render UI::ToggleGroup::Item.new(value: "left") do
    lucide_icon("align-left")
  end
  render UI::ToggleGroup::Item.new(value: "center") do
    lucide_icon("align-center")
  end
  render UI::ToggleGroup::Item.new(value: "right") do
    lucide_icon("align-right")
  end
end
```

## Accessibility

- **Single mode**: `role="radiogroup"` with `aria-checked`
- **Multiple mode**: `role="group"` with `aria-pressed`
- Full keyboard navigation support

## Error Prevention

### ❌ Wrong: Missing value

```ruby
render UI::ToggleGroup::Item.new { "Text" }  # Missing required value
```

### ✅ Correct: Always provide value

```ruby
render UI::ToggleGroup::Item.new(value: "unique-id") { "Text" }
```

### ❌ Wrong: Incorrect class path

```ruby
render UI::ToggleGroup.new  # Missing ::ToggleGroup
```

### ✅ Correct: Full class path

```ruby
render UI::ToggleGroup::ToggleGroup.new do
  render UI::ToggleGroup::Item.new(value: "1") { "Item" }
end
```
