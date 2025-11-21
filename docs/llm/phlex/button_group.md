# Button Group - Phlex

## Component Paths

- **ButtonGroup**: `UI::ButtonGroup::ButtonGroup`
- **Separator**: `UI::ButtonGroup::Separator`
- **Text**: `UI::ButtonGroup::Text`

## Description

A container that groups related buttons together with consistent styling.

## Basic Usage

```ruby
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :outline) { "Button 1" }
  render UI::Button::Button.new(variant: :outline) { "Button 2" }
end
```

## ButtonGroup Parameters

### Required

None

### Optional

- `orientation:` Symbol - Direction of the button group
  - Options: `:horizontal`, `:vertical`
  - Default: `:horizontal`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes (id, data, aria, etc.)

## ButtonGroupSeparator Parameters

### Optional

- `orientation:` Symbol - Direction of the separator
  - Options: `:horizontal`, `:vertical`
  - Default: `:vertical`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes

## ButtonGroupText Parameters

### Optional

- `as_child:` Boolean - Whether to yield attributes to a child component for custom rendering
  - Default: `false`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes

## Examples

### Basic Button Group

```ruby
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :outline) { "Archive" }
  render UI::Button::Button.new(variant: :outline) { "Report" }
end
```

### Vertical Orientation

```ruby
render UI::ButtonGroup::ButtonGroup.new(orientation: :vertical, classes: "h-fit") do
  render UI::Button::Button.new(variant: :outline, size: :icon) do
    # Plus icon SVG
  end
  render UI::Button::Button.new(variant: :outline, size: :icon) do
    # Minus icon SVG
  end
end
```

### Different Sizes

```ruby
# Small size
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :outline, size: :sm) { "Small" }
  render UI::Button::Button.new(variant: :outline, size: :sm) { "Button" }
  render UI::Button::Button.new(variant: :outline, size: :sm) { "Group" }
end

# Default size
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :outline) { "Default" }
  render UI::Button::Button.new(variant: :outline) { "Button" }
  render UI::Button::Button.new(variant: :outline) { "Group" }
end

# Large size
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :outline, size: :lg) { "Large" }
  render UI::Button::Button.new(variant: :outline, size: :lg) { "Button" }
  render UI::Button::Button.new(variant: :outline, size: :lg) { "Group" }
end
```

### Nested Button Groups

```ruby
# Create spacing between button groups
render UI::ButtonGroup::ButtonGroup.new do
  render UI::ButtonGroup::ButtonGroup.new do
    render UI::Button::Button.new(variant: :outline, size: :sm) { "1" }
    render UI::Button::Button.new(variant: :outline, size: :sm) { "2" }
    render UI::Button::Button.new(variant: :outline, size: :sm) { "3" }
  end

  render UI::ButtonGroup::ButtonGroup.new do
    render UI::Button::Button.new(variant: :outline, size: :"icon-sm") do
      # Previous icon SVG
    end
    render UI::Button::Button.new(variant: :outline, size: :"icon-sm") do
      # Next icon SVG
    end
  end
end
```

### With Separator

```ruby
# Use separator for non-outline variants
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :secondary, size: :sm) { "Copy" }
  render UI::ButtonGroup::Separator.new
  render UI::Button::Button.new(variant: :secondary, size: :sm) { "Paste" }
end
```

### Split Button

```ruby
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :secondary) { "Button" }
  render UI::ButtonGroup::Separator.new
  render UI::Button::Button.new(size: :icon, variant: :secondary) do
    # Plus icon SVG
  end
end
```

### With Input

```ruby
render UI::ButtonGroup::ButtonGroup.new do
  input(type: "text", placeholder: "Search...", class: "...")
  render UI::Button::Button.new(variant: :outline, attributes: { "aria-label": "Search" }) do
    # Search icon SVG
  end
end
```

### With Text

```ruby
render UI::ButtonGroup::ButtonGroup.new do
  render UI::ButtonGroup::Text.new { "Label" }
  render UI::Button::Button.new(variant: :outline) { "Button" }
end
```

### Text with asChild (as Label)

```ruby
render UI::ButtonGroup::ButtonGroup.new do
  render UI::ButtonGroup::Text.new(as_child: true) do |attrs|
    label(**attrs, for: "name") { "Name" }
  end
  input(type: "text", id: "name")
end
```

## Accessibility

- **ARIA**: The button group has `role="group"`
- **Navigation**: Use Tab to navigate between buttons
- **Labeling**: Use `aria-label` or `aria-labelledby` to label the button group

```ruby
render UI::ButtonGroup::ButtonGroup.new(attributes: { "aria-label": "Button group" }) do
  render UI::Button::Button.new(variant: :outline) { "Button 1" }
  render UI::Button::Button.new(variant: :outline) { "Button 2" }
end
```

## ButtonGroup vs ToggleGroup

- Use `ButtonGroup` when buttons **perform an action**
- Use `ToggleGroup` when buttons **toggle a state**

## Common Mistakes

### ❌ Wrong: Using module instead of nested class

```ruby
render UI::ButtonGroup.new  # ERROR: undefined method 'new' for module UI::ButtonGroup
```

### ✅ Correct: Use full path

```ruby
render UI::ButtonGroup::ButtonGroup.new  # Correct!
```

### ❌ Wrong: Adding separator to outline buttons

```ruby
# Unnecessary - outline buttons already have borders
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :outline) { "Copy" }
  render UI::ButtonGroup::Separator.new  # Not needed!
  render UI::Button::Button.new(variant: :outline) { "Paste" }
end
```

### ✅ Correct: Use separator for non-outline variants only

```ruby
render UI::ButtonGroup::ButtonGroup.new do
  render UI::Button::Button.new(variant: :secondary) { "Copy" }
  render UI::ButtonGroup::Separator.new  # Needed for visual hierarchy
  render UI::Button::Button.new(variant: :secondary) { "Paste" }
end
```

## Integration with Other Components

### With Dropdown Menu (Split Button)

Use `as_child: true` on DropdownMenu to attach its controller to ButtonGroup, avoiding wrapper div issues:

```ruby
# DropdownMenu yields controller attributes to ButtonGroup
render UI::DropdownMenu::DropdownMenu.new(as_child: true) do |dropdown_attrs|
  render UI::ButtonGroup::ButtonGroup.new(**dropdown_attrs) do
    render UI::Button::Button.new(variant: :outline) { "Follow" }

    # Trigger yields click action attributes to Button
    render UI::DropdownMenu::Trigger.new(as_child: true) do |trigger_attrs|
      render UI::Button::Button.new(**trigger_attrs, variant: :outline, size: :icon) do
        # ChevronDown icon SVG
      end
    end

    # Content MUST be inside ButtonGroup (controller scope)
    render UI::DropdownMenu::Content.new(align: :end) do
      render UI::DropdownMenu::Item.new { "Option 1" }
      render UI::DropdownMenu::Item.new { "Option 2" }
    end
  end
end
```

**Key points:**
- `as_child: true` on DropdownMenu prevents wrapper div that breaks ButtonGroup layout
- Content must be inside the element receiving dropdown controller attributes
- Both buttons appear as one continuous unit with proper border-radius

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/button-group
- Button component: `docs/llm/phlex/button.md`
- Separator component: `docs/llm/phlex/separator.md`
