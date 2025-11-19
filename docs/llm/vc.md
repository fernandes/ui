# ViewComponent - LLM Reference

This document provides LLM-friendly reference for using ViewComponent components in the UI Engine.

## General Usage Pattern

ViewComponent components are Ruby classes that inherit from `ViewComponent::Base`. They are rendered using the `render` helper.

### Basic Syntax

```ruby
<%= render UI::ComponentName::SubComponentComponent.new(param: value) do %>
  Content here
<% end %>
```

### Key Concepts

1. **Namespace**: All components are under the `UI` module
2. **Naming**: Component class names end with `Component` suffix
3. **Instantiation**: Always use `.new()` to create instances
4. **Parameters**: Pass as keyword arguments to `.new()`
5. **Content**: Provide via block using `do...end`
6. **Nesting**: Components can be nested inside other components

### Common Parameters

- `variant:` - Component style variant (`:default`, `:outline`, `:destructive`, etc.)
- `size:` - Component size (`:default`, `:sm`, `:lg`, `:icon`)
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

### Example: Button Component

```ruby
# Simple button
<%= render UI::Button::ButtonComponent.new { "Click me" } %>

# Button with variant and size
<%= render UI::Button::ButtonComponent.new(variant: :outline, size: :lg) { "Large Outline Button" } %>

# Button with custom classes
<%= render UI::Button::ButtonComponent.new(classes: "w-full") { "Full Width Button" } %>
```

## Available Components

See individual component documentation in `docs/llm/vc/` directory:

- [Button](vc/button.md) - Interactive button component
- [Accordion](vc/accordion.md) - Collapsible content sections
- [Alert Dialog](vc/alert_dialog.md) - Modal confirmation dialogs

## Component Composition

Components can be composed together. Child components are passed to parent via blocks:

```ruby
<%= render UI::Parent::ParentComponent.new do %>
  <%= render UI::Child::ChildComponent.new { "Child content" } %>
<% end %>
```

## File Location

Component files are located at:
- Engine: `app/components/ui/{component_name}/{sub_component}_component.rb`
- Your app: After installation via generator

## Error Prevention

### ❌ Wrong: Missing Component suffix

```ruby
<%= render UI::Button.new { "Text" } %>  # ERROR: UI::Button is a module, not a component
```

### ✅ Correct: Include Component suffix

```ruby
<%= render UI::Button::ButtonComponent.new { "Text" } %>  # Correct!
```

### ❌ Wrong: Calling without .new()

```ruby
<%= render UI::Button::ButtonComponent { "Text" } %>  # ERROR
```

### ✅ Correct: Always use .new()

```ruby
<%= render UI::Button::ButtonComponent.new { "Text" } %>  # Correct!
```

### ❌ Wrong: Passing content as parameter

```ruby
<%= render UI::Button::ButtonComponent.new(content: "Text") %>  # Won't work
```

### ✅ Correct: Content via block

```ruby
<%= render UI::Button::ButtonComponent.new { "Text" } %>  # Correct!
```

## Difference from Phlex

The main difference is the `Component` suffix and namespace structure:

```ruby
# ViewComponent
<%= render UI::Button::ButtonComponent.new { "Text" } %>

# Phlex (no Component suffix, simpler namespace)
<%= render UI::Button.new { "Text" } %>
```
