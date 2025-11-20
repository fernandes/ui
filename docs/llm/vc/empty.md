# Empty - ViewComponent

## Component Paths

```ruby
UI::Empty::EmptyComponent              # Main container
UI::Empty::EmptyHeaderComponent         # Header wrapper
UI::Empty::EmptyMediaComponent          # Visual media
UI::Empty::EmptyTitleComponent          # Title heading
UI::Empty::EmptyDescriptionComponent    # Description text
UI::Empty::EmptyContentComponent        # Action area
```

## Description

Displays empty states in applications with customizable media, titles, descriptions, and actions.

## Basic Usage

```erb
<%= render UI::Empty::EmptyComponent.new do %>
  <%= render UI::Empty::EmptyHeaderComponent.new do %>
    <%= render UI::Empty::EmptyTitleComponent.new { "No results found" } %>
    <%= render UI::Empty::EmptyDescriptionComponent.new { "Try adjusting your search criteria." } %>
  <% end %>
<% end %>
```

## Sub-Components

### UI::Empty::EmptyComponent

Main container wrapping all empty state content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyHeaderComponent

Wraps the empty media, title, and description.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyMediaComponent

Displays visual content like icons or avatars.

**Parameters:**
- `variant:` String - Display variant (`"default"` or `"icon"`)
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyTitleComponent

Displays the title as an `<h3>` element.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyDescriptionComponent

Displays the description as a `<p>` element.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyContentComponent

Displays action area content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

## Examples

### Basic Empty State

```erb
<%= render UI::Empty::EmptyComponent.new do %>
  <%= render UI::Empty::EmptyHeaderComponent.new do %>
    <%= render UI::Empty::EmptyTitleComponent.new { "No results found" } %>
    <%= render UI::Empty::EmptyDescriptionComponent.new { "Try adjusting your search criteria." } %>
  <% end %>
<% end %>
```

### With Icon Media

```erb
<%= render UI::Empty::EmptyComponent.new do %>
  <%= render UI::Empty::EmptyHeaderComponent.new do %>
    <%= render UI::Empty::EmptyMediaComponent.new(variant: "icon") do %>
      <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    <% end %>
    <%= render UI::Empty::EmptyTitleComponent.new { "No items" } %>
    <%= render UI::Empty::EmptyDescriptionComponent.new { "Get started by creating your first item." } %>
  <% end %>
  <%= render UI::Empty::EmptyContentComponent.new do %>
    <%= render UI::Button::ButtonComponent.new { "Create Item" } %>
  <% end %>
<% end %>
```

### With Border (Outline Variant)

```erb
<%= render UI::Empty::EmptyComponent.new(classes: "border border-dashed") do %>
  <%= render UI::Empty::EmptyHeaderComponent.new do %>
    <%= render UI::Empty::EmptyTitleComponent.new { "No projects" } %>
    <%= render UI::Empty::EmptyDescriptionComponent.new { "Create a new project to get started." } %>
  <% end %>
<% end %>
```

### With Background Gradient

```erb
<%= render UI::Empty::EmptyComponent.new(classes: "bg-gradient-to-b from-muted/50") do %>
  <%= render UI::Empty::EmptyHeaderComponent.new do %>
    <%= render UI::Empty::EmptyMediaComponent.new(variant: "icon") do %>
      <%# Icon SVG %>
    <% end %>
    <%= render UI::Empty::EmptyTitleComponent.new { "No messages" } %>
    <%= render UI::Empty::EmptyDescriptionComponent.new { "Start a conversation to see messages here." } %>
  <% end %>
<% end %>
```

### With Button Action

```erb
<%= render UI::Empty::EmptyComponent.new do %>
  <%= render UI::Empty::EmptyHeaderComponent.new do %>
    <%= render UI::Empty::EmptyMediaComponent.new(variant: "icon") do %>
      <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    <% end %>
    <%= render UI::Empty::EmptyTitleComponent.new { "No documents" } %>
    <%= render UI::Empty::EmptyDescriptionComponent.new { "You haven't created any documents yet." } %>
  <% end %>
  <%= render UI::Empty::EmptyContentComponent.new do %>
    <%= render UI::Button::ButtonComponent.new { "Create Document" } %>
  <% end %>
<% end %>
```

### Minimal Empty State

```erb
<%= render UI::Empty::EmptyComponent.new do %>
  <%= render UI::Empty::EmptyHeaderComponent.new do %>
    <%= render UI::Empty::EmptyTitleComponent.new { "Nothing to see here" } %>
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Using Module Instead of Component

```erb
<%= render UI::Empty.new %>
```

**Why it's wrong:** `UI::Empty` is a module namespace.

### ✅ Correct - Full Path to Component Class

```erb
<%= render UI::Empty::EmptyComponent.new %>
```

### ❌ Wrong - Missing <%= (No Equals Sign)

```erb
<% render UI::Empty::EmptyComponent.new %>
```

**Why it's wrong:** Without `=`, the component won't be output.

### ✅ Correct - Use <%= to Output

```erb
<%= render UI::Empty::EmptyComponent.new %>
```

### ❌ Wrong - Forgetting EmptyHeaderComponent Wrapper

```erb
<%= render UI::Empty::EmptyComponent.new do %>
  <%= render UI::Empty::EmptyTitleComponent.new { "Title" } %>
<% end %>
```

**Why it's wrong:** EmptyHeader provides max-width constraint and proper spacing.

### ✅ Correct - Use EmptyHeaderComponent

```erb
<%= render UI::Empty::EmptyComponent.new do %>
  <%= render UI::Empty::EmptyHeaderComponent.new do %>
    <%= render UI::Empty::EmptyTitleComponent.new { "Title" } %>
  <% end %>
<% end %>
```

### ❌ Wrong - Using Symbol for Variant

```erb
<%= render UI::Empty::EmptyMediaComponent.new(variant: :icon) %>
```

**Why it's wrong:** Variant expects a String.

### ✅ Correct - String for Variant

```erb
<%= render UI::Empty::EmptyMediaComponent.new(variant: "icon") %>
```

## Integration with Other Components

### With Button

```erb
<%= render UI::Empty::EmptyContentComponent.new do %>
  <%= render UI::Button::ButtonComponent.new { "Take Action" } %>
<% end %>
```

### With Input

```erb
<%= render UI::Empty::EmptyContentComponent.new do %>
  <%= render UI::Input::InputComponent.new(placeholder: "Search...") %>
<% end %>
```

## See Also

- Phlex docs: `docs/llm/phlex/empty.md`
- ERB docs: `docs/llm/erb/empty.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/empty
