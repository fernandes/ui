# Input Group - ViewComponent

## Component Paths

```ruby
UI::InputGroup::InputGroupComponent          # Main container
UI::InputGroup::InputGroupInputComponent      # Input element
UI::InputGroup::InputGroupTextareaComponent   # Textarea element
UI::InputGroup::InputGroupAddonComponent      # Addon container
UI::InputGroup::InputGroupButtonComponent     # Button
UI::InputGroup::InputGroupTextComponent       # Text display
```

## Description

A wrapper component for grouping inputs with addons, buttons, labels, and other elements.

## Basic Usage

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(placeholder: "Enter text") %>
<% end %>
```

## Sub-Components

### UI::InputGroup::InputGroupComponent

Main wrapper container.

**Parameters:**
- `classes:` String
- `**attributes` Hash

### UI::InputGroup::InputGroupInputComponent

Input element for input groups.

**Parameters:**
- `placeholder:` String
- `type:` String (default: `"text"`)
- `classes:` String
- `**attributes` Hash

### UI::InputGroup::InputGroupTextareaComponent

Textarea element for input groups.

**Parameters:**
- `placeholder:` String
- `classes:` String
- `**attributes` Hash

### UI::InputGroup::InputGroupAddonComponent

Addon container.

**Parameters:**
- `align:` String - `"inline-start"`, `"inline-end"`, `"block-start"`, `"block-end"` (default: `"inline-start"`)
- `classes:` String
- `**attributes` Hash

### UI::InputGroup::InputGroupButtonComponent

Button for input groups.

**Parameters:**
- `size:` String - `"xs"`, `"sm"`, `"icon-xs"`, `"icon-sm"` (default: `"xs"`)
- `variant:` String (default: `"ghost"`)
- `type:` String (default: `"button"`)
- `classes:` String
- `**attributes` Hash

### UI::InputGroup::InputGroupTextComponent

Text display within addons.

**Parameters:**
- `classes:` String
- `**attributes` Hash

## Examples

### Basic Input

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(placeholder: "Enter your email") %>
<% end %>
```

### With Icon Addon

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-start") do %>
    <svg class="size-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  <% end %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(placeholder: "Search...") %>
<% end %>
```

### With Text Addon (Currency)

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-start") do %>
    <%= render(UI::InputGroup::InputGroupTextComponent.new) { "$" } %>
  <% end %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(type: "number", placeholder: "0.00") %>
<% end %>
```

### With Button Addon

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(placeholder: "Enter URL") %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-end") do %>
    <%= render(UI::InputGroup::InputGroupButtonComponent.new) do %>
      <svg class="size-3.5"><path d="..."/></svg>
    <% end %>
  <% end %>
<% end %>
```

### With Both Addons

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-start") do %>
    <%= render(UI::InputGroup::InputGroupTextComponent.new) { "https://" } %>
  <% end %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(placeholder: "example.com") %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-end") do %>
    <%= render(UI::InputGroup::InputGroupTextComponent.new) { ".com" } %>
  <% end %>
<% end %>
```

### Textarea with Block Addon

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupTextareaComponent.new(placeholder: "Write your message", rows: 4) %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "block-end") do %>
    <%= render(UI::InputGroup::InputGroupButtonComponent.new) { "Send" } %>
  <% end %>
<% end %>
```

### With Label

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "block-start") do %>
    <%= render(UI::Label::LabelComponent.new(for: "email")) { "Email address" } %>
  <% end %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(id: "email", placeholder: "you@example.com") %>
<% end %>
```

## Common Patterns

### Search Input

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-start") do %>
    <svg class="size-4"><path d="search icon"/></svg>
  <% end %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(placeholder: "Search...") %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-end") do %>
    <%= render(UI::Kbd::KbdComponent.new) { "⌘K" } %>
  <% end %>
<% end %>
```

### Email Input

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-start") do %>
    <%= render(UI::InputGroup::InputGroupTextComponent.new) { "@" } %>
  <% end %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(type: "email", placeholder: "username") %>
<% end %>
```

### Amount Input

```erb
<%= render UI::InputGroup::InputGroupComponent.new do %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-start") do %>
    <%= render(UI::InputGroup::InputGroupTextComponent.new) { "$" } %>
  <% end %>
  <%= render UI::InputGroup::InputGroupInputComponent.new(type: "number", placeholder: "0.00") %>
  <%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-end") do %>
    <%= render(UI::InputGroup::InputGroupTextComponent.new) { "USD" } %>
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Using Module Instead of Component

```erb
<%= render UI::InputGroup.new %>
```

**Why it's wrong:** `UI::InputGroup` is a module namespace.

### ✅ Correct - Full Path to Component Class

```erb
<%= render UI::InputGroup::InputGroupComponent.new %>
```

### ❌ Wrong - Missing <%= (No Equals Sign)

```erb
<% render UI::InputGroup::InputGroupComponent.new %>
```

### ✅ Correct - Use <%= to Output

```erb
<%= render UI::InputGroup::InputGroupComponent.new %>
```

### ❌ Wrong - Using Symbol for Align

```erb
<%= render UI::InputGroup::InputGroupAddonComponent.new(align: :inline_start) %>
```

### ✅ Correct - String with Hyphens

```erb
<%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-start") %>
```

### ❌ Wrong - Wrong Addon Alignment for Textarea

```erb
<%= render UI::InputGroup::InputGroupAddonComponent.new(align: "inline-end") %>
  <%# Used with textarea - should be block-end! %>
```

### ✅ Correct - Block Alignment for Textarea

```erb
<%= render UI::InputGroup::InputGroupAddonComponent.new(align: "block-end") %>
```

## See Also

- Phlex docs: `docs/llm/phlex/input_group.md`
- ERB docs: `docs/llm/erb/input_group.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/input-group
