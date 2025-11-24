# Progress Component - Phlex

Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.

## Component Path

```ruby
UI::Progress::Progress
```

## Parameters

- `value` (Numeric, default: 0) - Progress value between 0 and 100
- `classes` (String, default: "") - Additional CSS classes
- `attributes` (Hash, default: {}) - Additional HTML attributes

## Basic Usage

```ruby
# Simple progress bar
render UI::Progress::Progress.new(value: 60)

# Custom height
render UI::Progress::Progress.new(value: 75, classes: "h-4")

# With custom styling
render UI::Progress::Progress.new(value: 33, classes: "w-3/5 h-3")
```

## Dynamic Progress Example

```ruby
# In your Phlex component
div(class: "space-y-4") do
  render UI::Progress::Progress.new(value: @upload_progress)

  p(class: "text-sm text-muted-foreground") do
    plain "#{@upload_progress}% complete"
  end
end
```

## Loading States

```ruby
# Indeterminate (no value)
render UI::Progress::Progress.new

# Starting state
render UI::Progress::Progress.new(value: 0)

# Complete
render UI::Progress::Progress.new(value: 100)
```

## Accessibility

The component automatically includes proper ARIA attributes:
- `role="progressbar"`
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-valuenow` - Set to current value

## Styling

Default styles:
- Height: `h-2` (8px)
- Width: `w-full`
- Background: `bg-primary/20`
- Indicator: `bg-primary`
- Border radius: `rounded-full`
- Transition: `transition-all`

## Common Mistakes

❌ **WRONG** - Using module instead of class:
```ruby
render UI::Progress.new(value: 50)
```

✅ **CORRECT** - Using full class path:
```ruby
render UI::Progress::Progress.new(value: 50)
```

❌ **WRONG** - Value outside 0-100 range (will be clamped):
```ruby
render UI::Progress::Progress.new(value: 150)  # Displayed as 100
```

✅ **CORRECT** - Value within range:
```ruby
render UI::Progress::Progress.new(value: 75)
```
