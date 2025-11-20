# Phlex Components - Overview

## About Phlex

Phlex is a Ruby framework for building fast, object-oriented HTML views. In UI Engine, Phlex is the primary component format.

## Namespace Pattern

All components follow this structure:

```
UI::ComponentName::SubComponent
```

Examples:
- `UI::Button::Button` - The button component
- `UI::Dialog::Dialog` - Dialog container
- `UI::Dialog::Trigger` - Dialog trigger button
- `UI::Dialog::Content` - Dialog content area

## Common Pattern

```ruby
# Rendering a component
render UI::ComponentName::SubComponent.new(**options) do
  # Block content
end

# With parameters
render UI::Button::Button.new(variant: :outline, size: :lg) do
  "Click me"
end

# With asChild composition
render UI::Dialog::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs, variant: :destructive) do
    "Delete"
  end
end
```

## Common Parameters

Most components support:

- `classes:` - Additional Tailwind classes
- `**attributes` - Any HTML attributes (id, data, aria, etc.)

Components that support composition:
- `as_child:` - Boolean, yields attributes to block instead of rendering wrapper

## Important Notes

### ❌ Common Mistakes

```ruby
# WRONG: Using module name
UI::Button.new

# CORRECT: Using component class
UI::Button::Button.new
```

### ✅ Using Splat Operator with asChild

```ruby
# When receiving attributes from asChild
render ComponentName.new(as_child: true) do |attrs|
  # Use ** to spread hash into keyword arguments
  button(**attrs) do
    "Content"
  end
end
```

## Available Components

- [Accordion](phlex/accordion.md)
- [Alert Dialog](phlex/alert_dialog.md)
- [Button](phlex/button.md)
- [Dialog](phlex/dialog.md)
- [Label](phlex/label.md)

## See Individual Component Docs

Each component has detailed documentation in `docs/llm/phlex/{component}.md`.
