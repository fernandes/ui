# ERB Partials - LLM Reference

This document provides LLM-friendly reference for using ERB partials in the UI Engine.

## General Usage Pattern

ERB partials are traditional Rails partial files. They are rendered using the `render` helper with a path string.

### Basic Syntax

```erb
<%= render "ui/component_name/sub_component", param: value, content: "text" %>

<%# With block content %>
<%= render "ui/component_name/sub_component", param: value do %>
  Block content here
<% end %>
```

### Key Concepts

1. **Path**: Partials use string paths starting with `"ui/"`
2. **Underscore**: Partial files start with `_` but you don't include it in the path
3. **Parameters**: Pass as keyword arguments after the path
4. **Content**: Pass via `content:` parameter OR via block
5. **Nesting**: Nest partials inside other partials using blocks

### Common Parameters

- `variant:` - Component style variant (`:default`, `:outline`, `:destructive`, etc.)
- `size:` - Component size (`:default`, `:sm`, `:lg`, `:icon`)
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)
- `content:` - Text content (String) - alternative to block

### Example: Button Component

```erb
<%# Simple button with content parameter %>
<%= render "ui/button/button", content: "Click me" %>

<%# Button with variant and size %>
<%= render "ui/button/button", variant: :outline, size: :lg, content: "Large Outline Button" %>

<%# Button with block content %>
<%= render "ui/button/button", variant: :outline do %>
  <span>Button with HTML</span>
<% end %>
```

## Available Components

See individual component documentation in `docs/llm/erb/` directory:

- [Button](erb/button.md) - Interactive button component
- [Accordion](erb/accordion.md) - Collapsible content sections
- [Alert Dialog](erb/alert_dialog.md) - Modal confirmation dialogs

## Component Composition

Components can be composed together. Child components are passed to parent via blocks:

```erb
<%= render "ui/parent/parent" do %>
  <%= render "ui/child/child", content: "Child content" %>
<% end %>
```

## File Location

Partial files are located at:
- Engine: `app/views/ui/{component_name}/_{sub_component}.html.erb`
- Your app: After installation, these are copied or accessed via the engine

## Error Prevention

### ❌ Wrong: Using Phlex syntax

```erb
<%= render UI::Button.new { "Text" } %>  # Wrong - this is Phlex syntax
```

### ✅ Correct: Use string path

```erb
<%= render "ui/button/button", content: "Text" %>  # Correct!
```

### Content: Two Ways

Both approaches work:

```erb
<%# Approach 1: content parameter %>
<%= render "ui/button/button", content: "Click me" %>

<%# Approach 2: block %>
<%= render "ui/button/button" do %>
  Click me
<% end %>
```
