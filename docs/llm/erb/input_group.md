# Input Group - ERB

## Component Paths

```erb
<%= render "ui/input_group/input_group" %>      <%# Main container %>
<%= render "ui/input_group/input_group_input" %>  <%# Input element %>
<%= render "ui/input_group/input_group_textarea" %> <%# Textarea element %>
<%= render "ui/input_group/input_group_addon" %>  <%# Addon container %>
<%= render "ui/input_group/input_group_button" %> <%# Button %>
<%= render "ui/input_group/input_group_text" %>   <%# Text display %>
```

## Description

A wrapper component for grouping inputs with addons, buttons, labels, and other elements.

## Basic Usage

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_input", placeholder: "Enter text" %>
<% end %>
```

## Sub-Components

### ui/input_group/input_group

Main wrapper container.

**Parameters:**
- `classes:` String
- `attributes:` Hash

### ui/input_group/input_group_input

Input element for input groups.

**Parameters:**
- `placeholder:` String
- `type:` String (default: `"text"`)
- `classes:` String
- `attributes:` Hash

### ui/input_group/input_group_textarea

Textarea element for input groups.

**Parameters:**
- `placeholder:` String
- `classes:` String
- `attributes:` Hash

### ui/input_group/input_group_addon

Addon container.

**Parameters:**
- `align:` String - `"inline-start"`, `"inline-end"`, `"block-start"`, `"block-end"` (default: `"inline-start"`)
- `classes:` String
- `attributes:` Hash

### ui/input_group/input_group_button

Button for input groups.

**Parameters:**
- `size:` String - `"xs"`, `"sm"`, `"icon-xs"`, `"icon-sm"` (default: `"xs"`)
- `variant:` String (default: `"ghost"`)
- `type:` String (default: `"button"`)
- `content:` String - Button text (or use block)
- `classes:` String
- `attributes:` Hash

### ui/input_group/input_group_text

Text display within addons.

**Parameters:**
- `content:` String - Text to display (or use block)
- `classes:` String
- `attributes:` Hash

## Examples

### Basic Input

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_input", placeholder: "Enter your email" %>
<% end %>
```

### With Icon Addon

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_addon", align: "inline-start" do %>
    <svg class="size-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  <% end %>
  <%= render "ui/input_group/input_group_input", placeholder: "Search..." %>
<% end %>
```

### With Text Addon (Currency)

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_addon", align: "inline-start" do %>
    <%= render "ui/input_group/input_group_text", content: "$" %>
  <% end %>
  <%= render "ui/input_group/input_group_input", type: "number", placeholder: "0.00" %>
<% end %>
```

### With Button Addon

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_input", placeholder: "Enter URL" %>
  <%= render "ui/input_group/input_group_addon", align: "inline-end" do %>
    <%= render "ui/input_group/input_group_button" do %>
      <svg class="size-3.5"><path d="..."/></svg>
    <% end %>
  <% end %>
<% end %>
```

### With Both Addons

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_addon", align: "inline-start" do %>
    <%= render "ui/input_group/input_group_text", content: "https://" %>
  <% end %>
  <%= render "ui/input_group/input_group_input", placeholder: "example.com" %>
  <%= render "ui/input_group/input_group_addon", align: "inline-end" do %>
    <%= render "ui/input_group/input_group_text", content: ".com" %>
  <% end %>
<% end %>
```

### Textarea with Block Addon

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_textarea", placeholder: "Write your message", attributes: { rows: 4 } %>
  <%= render "ui/input_group/input_group_addon", align: "block-end" do %>
    <%= render "ui/input_group/input_group_button", content: "Send" %>
  <% end %>
<% end %>
```

### With Label

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_addon", align: "block-start" do %>
    <%= render "ui/label", for: "email", content: "Email address" %>
  <% end %>
  <%= render "ui/input_group/input_group_input", attributes: { id: "email" }, placeholder: "you@example.com" %>
<% end %>
```

## Common Patterns

### Search Input

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_addon", align: "inline-start" do %>
    <svg class="size-4"><path d="search icon"/></svg>
  <% end %>
  <%= render "ui/input_group/input_group_input", placeholder: "Search..." %>
  <%= render "ui/input_group/input_group_addon", align: "inline-end" do %>
    <%= render "ui/kbd", content: "⌘K" %>
  <% end %>
<% end %>
```

### Email Input

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_addon", align: "inline-start" do %>
    <%= render "ui/input_group/input_group_text", content: "@" %>
  <% end %>
  <%= render "ui/input_group/input_group_input", type: "email", placeholder: "username" %>
<% end %>
```

### Amount Input

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_addon", align: "inline-start" do %>
    <%= render "ui/input_group/input_group_text", content: "$" %>
  <% end %>
  <%= render "ui/input_group/input_group_input", type: "number", placeholder: "0.00" %>
  <%= render "ui/input_group/input_group_addon", align: "inline-end" do %>
    <%= render "ui/input_group/input_group_text", content: "USD" %>
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Missing <%= (No Equals Sign)

```erb
<% render "ui/input_group/input_group" %>
```

### ✅ Correct - Use <%= to Output

```erb
<%= render "ui/input_group/input_group" %>
```

### ❌ Wrong - Using Symbol for Align

```erb
<%= render "ui/input_group/input_group_addon", align: :inline_start %>
```

### ✅ Correct - String with Hyphens

```erb
<%= render "ui/input_group/input_group_addon", align: "inline-start" %>
```

### ❌ Wrong - Wrong Addon Alignment for Textarea

```erb
<%= render "ui/input_group/input_group_addon", align: "inline-end" %>
  <%# Used with textarea - should be block-end! %>
```

### ✅ Correct - Block Alignment for Textarea

```erb
<%= render "ui/input_group/input_group_addon", align: "block-end" %>
```

## See Also

- Phlex docs: `docs/llm/phlex/input_group.md`
- ViewComponent docs: `docs/llm/vc/input_group.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/input-group
