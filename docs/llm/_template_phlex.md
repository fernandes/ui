# {Component Name} - Phlex

## Component Path

```ruby
UI::{ComponentName}::{SubComponent}
```

## Description

{Brief description from shadcn/ui}

## Basic Usage

```ruby
render UI::{ComponentName}::{SubComponent}.new do
  # Content
end
```

## Parameters

### Required

None (or list if any)

### Optional

- `variant:` Symbol - Component variant
  - Options: `:default`, `:outline`, `:destructive` (example - adjust per component)
  - Default: `:default`

- `size:` Symbol - Component size
  - Options: `:sm`, `:default`, `:lg` (example - adjust per component)
  - Default: `:default`

- `classes:` String - Additional Tailwind CSS classes

- `as_child:` Boolean - Enable composition pattern (if supported)
  - When `true`, yields attributes hash to block instead of rendering wrapper
  - Default: `false`

- `**attributes` Hash - Any additional HTML attributes (id, data, aria, etc.)

## Sub-Components

(List all sub-components if this is a compound component)

### UI::{ComponentName}::{SubComponentA}

{Description and parameters}

### UI::{ComponentName}::{SubComponentB}

{Description and parameters}

## Examples

### Default

```ruby
render UI::{ComponentName}::{SubComponent}.new do
  "Content"
end
```

### With Variant

```ruby
render UI::{ComponentName}::{SubComponent}.new(variant: :outline) do
  "Content"
end
```

### With asChild Composition

```ruby
render UI::{ComponentName}::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs, variant: :destructive) do
    "Custom Trigger"
  end
end
```

## Common Patterns

{Include common usage patterns specific to this component}

## Accessibility

- Keyboard: {List keyboard shortcuts from Radix UI}
- ARIA: {List important ARIA attributes}

## Common Mistakes

### ❌ Wrong

```ruby
# Example of common mistake
```

**Why it's wrong:** {Explanation}

### ✅ Correct

```ruby
# Correct way
```

## Integration with Other Components

{Examples of using this component with others}

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/{component}
- Radix UI: https://www.radix-ui.com/primitives/docs/components/{component}
- Pattern docs: `docs/patterns/as_child.md` (if uses asChild)
