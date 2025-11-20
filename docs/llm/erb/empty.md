# Empty - ERB

## Component Paths

```erb
<%= render "ui/empty" %>                    <%# Main container %>
<%= render "ui/empty/header" %>             <%# Header wrapper %>
<%= render "ui/empty/media" %>              <%# Visual media %>
<%= render "ui/empty/title" %>              <%# Title heading %>
<%= render "ui/empty/description" %>        <%# Description text %>
<%= render "ui/empty/content" %>            <%# Action area %>
```

## Description

Displays empty states in applications with customizable media, titles, descriptions, and actions.

## Basic Usage

```erb
<%= render "ui/empty" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/title", content: "No results found" %>
    <%= render "ui/empty/description", content: "Try adjusting your search criteria." %>
  <% end %>
<% end %>
```

## Sub-Components

### ui/empty

Main container wrapping all empty state content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `attributes:` Hash - Any additional HTML attributes

### ui/empty/header

Wraps the empty media, title, and description.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `attributes:` Hash - Any additional HTML attributes

### ui/empty/media

Displays visual content like icons or avatars.

**Parameters:**
- `variant:` String - Display variant (`"default"` or `"icon"`)
- `classes:` String - Additional Tailwind CSS classes
- `attributes:` Hash - Any additional HTML attributes

### ui/empty/title

Displays the title as an `<h3>` element.

**Parameters:**
- `content:` String - Title text (use `content:` for text-only)
- `classes:` String - Additional Tailwind CSS classes
- `attributes:` Hash - Any additional HTML attributes

### ui/empty/description

Displays the description as a `<p>` element.

**Parameters:**
- `content:` String - Description text (use `content:` for text-only)
- `classes:` String - Additional Tailwind CSS classes
- `attributes:` Hash - Any additional HTML attributes

### ui/empty/content

Displays action area content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `attributes:` Hash - Any additional HTML attributes

## Examples

### Basic Empty State

```erb
<%= render "ui/empty" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/title", content: "No results found" %>
    <%= render "ui/empty/description", content: "Try adjusting your search criteria." %>
  <% end %>
<% end %>
```

### With Icon Media

```erb
<%= render "ui/empty" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/media", variant: "icon" do %>
      <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    <% end %>
    <%= render "ui/empty/title", content: "No items" %>
    <%= render "ui/empty/description", content: "Get started by creating your first item." %>
  <% end %>
  <%= render "ui/empty/content" do %>
    <%= render "ui/button", content: "Create Item" %>
  <% end %>
<% end %>
```

### With Border (Outline Variant)

```erb
<%= render "ui/empty", classes: "border border-dashed" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/title", content: "No projects" %>
    <%= render "ui/empty/description", content: "Create a new project to get started." %>
  <% end %>
<% end %>
```

### With Background Gradient

```erb
<%= render "ui/empty", classes: "bg-gradient-to-b from-muted/50" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/media", variant: "icon" do %>
      <%# Icon SVG %>
    <% end %>
    <%= render "ui/empty/title", content: "No messages" %>
    <%= render "ui/empty/description", content: "Start a conversation to see messages here." %>
  <% end %>
<% end %>
```

### With Button Action

```erb
<%= render "ui/empty" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/media", variant: "icon" do %>
      <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    <% end %>
    <%= render "ui/empty/title", content: "No documents" %>
    <%= render "ui/empty/description", content: "You haven't created any documents yet." %>
  <% end %>
  <%= render "ui/empty/content" do %>
    <%= render "ui/button", content: "Create Document" %>
  <% end %>
<% end %>
```

### With Input Group

```erb
<%= render "ui/empty" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/media", variant: "icon" do %>
      <%# Search icon %>
    <% end %>
    <%= render "ui/empty/title", content: "No results" %>
    <%= render "ui/empty/description", content: "We couldn't find what you're looking for." %>
  <% end %>
  <%= render "ui/empty/content" do %>
    <%= render "ui/input", placeholder: "Search again..." %>
  <% end %>
<% end %>
```

### Minimal Empty State

```erb
<%= render "ui/empty" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/title", content: "Nothing to see here" %>
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Missing <%= (No Equals Sign)

```erb
<% render "ui/empty" %>
```

**Why it's wrong:** Without `=`, the component won't be output.

### ✅ Correct - Use <%= to Output

```erb
<%= render "ui/empty" %>
```

### ❌ Wrong - Forgetting Empty/Header Wrapper

```erb
<%= render "ui/empty" do %>
  <%= render "ui/empty/title", content: "Title" %>
<% end %>
```

**Why it's wrong:** EmptyHeader provides max-width constraint and proper spacing.

### ✅ Correct - Use Empty/Header

```erb
<%= render "ui/empty" do %>
  <%= render "ui/empty/header" do %>
    <%= render "ui/empty/title", content: "Title" %>
  <% end %>
<% end %>
```

### ❌ Wrong - Using Symbol for Variant

```erb
<%= render "ui/empty/media", variant: :icon %>
```

**Why it's wrong:** Variant expects a String.

### ✅ Correct - String for Variant

```erb
<%= render "ui/empty/media", variant: "icon" %>
```

## Integration with Other Components

### With Button

```erb
<%= render "ui/empty/content" do %>
  <%= render "ui/button", content: "Take Action" %>
<% end %>
```

### With Input

```erb
<%= render "ui/empty/content" do %>
  <%= render "ui/input", placeholder: "Search..." %>
<% end %>
```

## See Also

- Phlex docs: `docs/llm/phlex/empty.md`
- ViewComponent docs: `docs/llm/vc/empty.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/empty
