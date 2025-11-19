# Alert - ERB

## Component Path

```erb
<%= render "ui/alert/{component}" %>
```

## Description

A callout component for displaying important messages, notifications, or information to users. The Alert component is non-interactive and provides a visually distinct way to present status updates, warnings, or success messages.

Based on [shadcn/ui Alert](https://ui.shadcn.com/docs/components/alert).

## Basic Usage

```erb
<%= render "ui/alert/alert", variant: :default do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>

  <%= render "ui/alert/title" do %>
    Success
  <% end %>

  <%= render "ui/alert/description" do %>
    Your changes have been saved successfully.
  <% end %>
<% end %>
```

## Sub-Components

### ui/alert/alert

Main container that wraps the alert content. Provides variant styling and icon support.

**Parameters:**
- `variant:` Symbol - Visual style variant
  - Options: `:default`, `:destructive`
  - Default: `:default`
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via local variables

**Example:**
```erb
<%= render "ui/alert/alert", variant: :default do %>
  <!-- Alert content -->
<% end %>
```

### ui/alert/title

Title text for the alert.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via local variables

**Example:**
```erb
<%= render "ui/alert/title" do %>
  Important Notice
<% end %>
```

### ui/alert/description

Description text for the alert. Supports paragraphs and nested content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- Other HTML attributes via local variables

**Example:**
```erb
<%= render "ui/alert/description" do %>
  Your account has been successfully updated.
<% end %>
```

## Variants

### Default

```erb
<%= render "ui/alert/alert", variant: :default do %>
  <%= render "ui/alert/title" do %>Heads up!<% end %>
  <%= render "ui/alert/description" do %>
    You can add components using the CLI.
  <% end %>
<% end %>
```

### Destructive

```erb
<%= render "ui/alert/alert", variant: :destructive do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-circle-alert">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v4"/>
    <path d="M12 16h.01"/>
  </svg>

  <%= render "ui/alert/title" do %>Error<% end %>
  <%= render "ui/alert/description" do %>
    Your session has expired. Please log in again.
  <% end %>
<% end %>
```

## Examples

### Success Notification

```erb
<%= render "ui/alert/alert" do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-circle-check">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>

  <%= render "ui/alert/title" do %>Success<% end %>
  <%= render "ui/alert/description" do %>
    Operation completed successfully.
  <% end %>
<% end %>
```

### Warning Message

```erb
<%= render "ui/alert/alert", variant: :destructive do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-triangle-alert">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <path d="M12 17h.01"/>
  </svg>

  <%= render "ui/alert/title" do %>Warning<% end %>
  <%= render "ui/alert/description" do %>
    This action cannot be undone.
  <% end %>
<% end %>
```

### Info Message

```erb
<%= render "ui/alert/alert" do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-info">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>

  <%= render "ui/alert/title" do %>Did you know?<% end %>
  <%= render "ui/alert/description" do %>
    You can use keyboard shortcuts to navigate faster.
  <% end %>
<% end %>
```

### Alert Without Title

```erb
<%= render "ui/alert/alert" do %>
  <%= render "ui/alert/description" do %>
    This is a simple notification without a title.
  <% end %>
<% end %>
```

### Custom Styling

```erb
<%= render "ui/alert/alert", classes: "border-blue-500" do %>
  <%= render "ui/alert/title", classes: "text-blue-600" do %>
    Information
  <% end %>
  <%= render "ui/alert/description", classes: "text-blue-800" do %>
    Custom styled alert with blue accents.
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Using string instead of symbol

```erb
<%= render "ui/alert/alert", variant: "destructive" do %>
  <!-- Won't work -->
<% end %>
```

**Why it's wrong:** Parameters must be symbols, not strings.

### ✅ Correct - Use symbols

```erb
<%= render "ui/alert/alert", variant: :destructive do %>
  <!-- This works -->
<% end %>
```

### ❌ Wrong - Missing <%= for output

```erb
<% render "ui/alert/alert" do %>
  <!-- Won't display! -->
<% end %>
```

**Why it's wrong:** `<% ... %>` executes but doesn't output. Use `<%= ... %>`.

### ✅ Correct - Use <%= to output

```erb
<%= render "ui/alert/alert" do %>
  <!-- This displays -->
<% end %>
```

### ❌ Wrong - Not using sub-components

```erb
<%= render "ui/alert/alert" do %>
  Just some text here
<% end %>
```

**Why it's wrong:** Alert expects Title and/or Description for proper styling.

### ✅ Correct - Use sub-components

```erb
<%= render "ui/alert/alert" do %>
  <%= render "ui/alert/title" do %>Title<% end %>
  <%= render "ui/alert/description" do %>Description<% end %>
<% end %>
```

## Accessibility

**Semantic HTML:**
- Uses `role="alert"` attribute
- Properly announces to screen readers

**Best Practices:**
- Include descriptive text
- Use appropriate variant
- Add icons for visual users

## See Also

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/alert.md`
- ViewComponent implementation: `docs/llm/vc/alert.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/alert
