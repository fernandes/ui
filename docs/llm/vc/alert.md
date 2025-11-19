# Alert - ViewComponent

## Component Path

```ruby
UI::Alert::{ComponentName}
```

## Description

A callout component for displaying important messages, notifications, or information to users. The Alert component is non-interactive and provides a visually distinct way to present status updates, warnings, or success messages.

Based on [shadcn/ui Alert](https://ui.shadcn.com/docs/components/alert).

## Basic Usage

```ruby
<%= render UI::Alert::AlertComponent.new(variant: :default) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>

  <%= render UI::Alert::TitleComponent.new do %>
    Success
  <% end %>

  <%= render UI::Alert::DescriptionComponent.new do %>
    Your changes have been saved successfully.
  <% end %>
<% end %>
```

## Sub-Components

### UI::Alert::AlertComponent

Main container that wraps the alert content. Provides variant styling and icon support.

**Parameters:**
- `variant:` Symbol - Visual style variant
  - Options: `:default`, `:destructive`
  - Default: `:default`
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```ruby
<%= render UI::Alert::AlertComponent.new(variant: :default) do %>
  <!-- Alert content -->
<% end %>
```

### UI::Alert::TitleComponent

Title text for the alert.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes

**Example:**
```ruby
<%= render UI::Alert::TitleComponent.new do %>
  Important Notice
<% end %>
```

### UI::Alert::DescriptionComponent

Description text for the alert. Supports paragraphs and nested content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes

**Example:**
```ruby
<%= render UI::Alert::DescriptionComponent.new do %>
  Your account has been successfully updated.
<% end %>
```

## Variants

### Default

```ruby
<%= render UI::Alert::AlertComponent.new(variant: :default) do %>
  <%= render UI::Alert::TitleComponent.new do %>Heads up!<% end %>
  <%= render UI::Alert::DescriptionComponent.new do %>
    You can add components using the CLI.
  <% end %>
<% end %>
```

### Destructive

```ruby
<%= render UI::Alert::AlertComponent.new(variant: :destructive) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-circle-alert">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v4"/>
    <path d="M12 16h.01"/>
  </svg>

  <%= render UI::Alert::TitleComponent.new do %>Error<% end %>
  <%= render UI::Alert::DescriptionComponent.new do %>
    Your session has expired. Please log in again.
  <% end %>
<% end %>
```

## Examples

### Success Notification

```ruby
<%= render UI::Alert::AlertComponent.new do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-circle-check">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>

  <%= render UI::Alert::TitleComponent.new do %>Success<% end %>
  <%= render UI::Alert::DescriptionComponent.new do %>
    Operation completed successfully.
  <% end %>
<% end %>
```

### Warning Message

```ruby
<%= render UI::Alert::AlertComponent.new(variant: :destructive) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-triangle-alert">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <path d="M12 17h.01"/>
  </svg>

  <%= render UI::Alert::TitleComponent.new do %>Warning<% end %>
  <%= render UI::Alert::DescriptionComponent.new do %>
    This action cannot be undone.
  <% end %>
<% end %>
```

### Info Message

```ruby
<%= render UI::Alert::AlertComponent.new do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-info">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>

  <%= render UI::Alert::TitleComponent.new do %>Did you know?<% end %>
  <%= render UI::Alert::DescriptionComponent.new do %>
    You can use keyboard shortcuts to navigate faster.
  <% end %>
<% end %>
```

### Alert Without Title

```ruby
<%= render UI::Alert::AlertComponent.new do %>
  <%= render UI::Alert::DescriptionComponent.new do %>
    This is a simple notification without a title.
  <% end %>
<% end %>
```

### Custom Styling

```ruby
<%= render UI::Alert::AlertComponent.new(classes: "border-blue-500") do %>
  <%= render UI::Alert::TitleComponent.new(classes: "text-blue-600") do %>
    Information
  <% end %>
  <%= render UI::Alert::DescriptionComponent.new(classes: "text-blue-800") do %>
    Custom styled alert with blue accents.
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong - Using string instead of symbol

```ruby
<%= render UI::Alert::AlertComponent.new(variant: "destructive") do %>
  <!-- Won't work -->
<% end %>
```

**Why it's wrong:** Parameters must be symbols, not strings.

### ✅ Correct - Use symbols

```ruby
<%= render UI::Alert::AlertComponent.new(variant: :destructive) do %>
  <!-- This works -->
<% end %>
```

### ❌ Wrong - Wrong component name

```ruby
<%= render UI::Alert::Alert.new do %>
  <!-- Wrong - this is the Phlex component -->
<% end %>
```

**Why it's wrong:** ViewComponent uses `AlertComponent`, not `Alert`.

### ✅ Correct - Use Component suffix

```ruby
<%= render UI::Alert::AlertComponent.new do %>
  <!-- Correct ViewComponent -->
<% end %>
```

### ❌ Wrong - Not using sub-components

```ruby
<%= render UI::Alert::AlertComponent.new do %>
  Just some text
<% end %>
```

**Why it's wrong:** Alert expects TitleComponent and/or DescriptionComponent for proper styling.

### ✅ Correct - Use sub-components

```ruby
<%= render UI::Alert::AlertComponent.new do %>
  <%= render UI::Alert::TitleComponent.new do %>Title<% end %>
  <%= render UI::Alert::DescriptionComponent.new do %>Description<% end %>
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

- ViewComponent guide: `docs/llm/vc.md`
- Phlex implementation: `docs/llm/phlex/alert.md`
- ERB implementation: `docs/llm/erb/alert.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/alert
