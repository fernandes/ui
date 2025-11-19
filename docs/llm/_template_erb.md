# {Component Name} - ERB

## Component Path

```erb
<%= render UI::{ComponentName}::{SubComponent}.new %>
```

## Description

{Brief description from shadcn/ui}

## Basic Usage

```erb
<%= render UI::{ComponentName}::{SubComponent}.new do %>
  Content
<% end %>
```

## Parameters

### Required

None (or list if any)

### Optional

- `variant:` Symbol - Component variant
  - Options: `:default`, `:outline`, `:destructive`
  - Default: `:default`

- `size:` Symbol - Component size
  - Options: `:sm`, `:default`, `:lg`
  - Default: `:default`

- `classes:` String - Additional Tailwind CSS classes

- `as_child:` Boolean - Enable composition pattern (if supported)
  - When `true`, yields attributes hash to block
  - Default: `false`

## Sub-Components

(List all sub-components)

## Examples

### Default

```erb
<%= render UI::{ComponentName}::{SubComponent}.new do %>
  Content
<% end %>
```

### With Parameters

```erb
<%= render UI::{ComponentName}::{SubComponent}.new(variant: :outline, size: :lg) do %>
  Content
<% end %>
```

### With asChild

```erb
<%= render UI::{ComponentName}::Trigger.new(as_child: true) do |attrs| %>
  <%= render UI::Button::Button.new(**attrs, variant: :destructive) do %>
    Custom Trigger
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - String instead of Symbol

```erb
<%= render UI::{ComponentName}::{SubComponent}.new(variant: "outline") %>
```

### ✅ Correct - Use Symbol

```erb
<%= render UI::{ComponentName}::{SubComponent}.new(variant: :outline) %>
```

### ❌ Wrong - Missing =

```erb
<% render UI::{ComponentName}::{SubComponent}.new %>
```

### ✅ Correct - Use <%= to Output

```erb
<%= render UI::{ComponentName}::{SubComponent}.new %>
```

## See Also

- Phlex docs: `docs/llm/phlex/{component}.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/{component}
