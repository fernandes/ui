# Phlex Components - LLM Reference

This document provides LLM-friendly reference for using Phlex components in the UI Engine.

## General Usage Pattern

Phlex components are Ruby classes that inherit from `Phlex::HTML`. They are rendered using the `render` helper.

### Basic Syntax

```ruby
<%= render UI::ComponentName::SubComponent.new(param: value) do %>
  Content here
<% end %>
```

### Key Concepts

1. **Namespace**: All components are under the `UI` module
2. **Instantiation**: Always use `.new()` to create instances
3. **Parameters**: Pass as keyword arguments to `.new()`
4. **Content**: Provide via block using `do...end`
5. **Nesting**: Components can be nested inside other components

### Common Parameters

- `variant:` - Component style variant (`:default`, `:outline`, `:destructive`, etc.)
- `size:` - Component size (`:default`, `:sm`, `:lg`, `:icon`)
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

### Example: Button Component

```ruby
# Simple button
<%= render UI::Button.new { "Click me" } %>

# Button with variant and size
<%= render UI::Button.new(variant: :outline, size: :lg) { "Large Outline Button" } %>

# Button with custom classes
<%= render UI::Button.new(classes: "w-full") { "Full Width Button" } %>
```

## Available Components

See individual component documentation in `docs/llm/phlex/` directory:

- [Button](phlex/button.md) - Interactive button component
- [Accordion](phlex/accordion.md) - Collapsible content sections
- [Alert Dialog](phlex/alert_dialog.md) - Modal confirmation dialogs

## Component Composition

Components can be composed together. Child components are passed to parent via blocks:

```ruby
<%= render UI::Parent.new do %>
  <%= render UI::Child.new { "Child content" } %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Calling without .new()

```ruby
<%= render UI::Button { "Text" } %>  # ERROR: undefined method 'new' for module
```

### ✅ Correct: Always use .new()

```ruby
<%= render UI::Button.new { "Text" } %>  # Correct!
```

### ❌ Wrong: Passing content as parameter

```ruby
<%= render UI::Button.new(content: "Text") %>  # Won't work
```

### ✅ Correct: Content via block

```ruby
<%= render UI::Button.new { "Text" } %>  # Correct!
```
