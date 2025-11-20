# Spinner - ViewComponent

## Component Path

```ruby
UI::Spinner::SpinnerComponent
```

## Description

An indicator that can be used to show a loading state.

## Basic Usage

```erb
<%= render UI::Spinner::SpinnerComponent.new %>
```

## Parameters

### Required

None

### Optional

- `size:` String - Spinner size
  - Options: `"sm"`, `"default"`, `"lg"`, `"xl"`
  - Default: `"default"`
  - `"sm"` → `size-3` (12px)
  - `"default"` → `size-4` (16px)
  - `"lg"` → `size-6` (24px)
  - `"xl"` → `size-8` (32px)

- `classes:` String - Additional Tailwind CSS classes (commonly used for color: `"text-blue-500"`, `"text-red-500"`)

- `**attributes` Hash - Any additional HTML attributes (id, data, aria, etc.)

## Sub-Components

This is a single component with no sub-components.

## Examples

### Default

```erb
<%= render UI::Spinner::SpinnerComponent.new %>
```

### Size Variants

```erb
<%# Small spinner %>
<%= render UI::Spinner::SpinnerComponent.new(size: "sm") %>

<%# Default spinner %>
<%= render UI::Spinner::SpinnerComponent.new(size: "default") %>

<%# Large spinner %>
<%= render UI::Spinner::SpinnerComponent.new(size: "lg") %>

<%# Extra large spinner %>
<%= render UI::Spinner::SpinnerComponent.new(size: "xl") %>
```

### Color Variants

```erb
<%# Primary color %>
<%= render UI::Spinner::SpinnerComponent.new(classes: "text-primary") %>

<%# Blue spinner %>
<%= render UI::Spinner::SpinnerComponent.new(classes: "text-blue-500") %>

<%# Red spinner %>
<%= render UI::Spinner::SpinnerComponent.new(classes: "text-red-500") %>

<%# Green spinner %>
<%= render UI::Spinner::SpinnerComponent.new(classes: "text-green-500") %>
```

### In Button (Loading State)

```erb
<%= render UI::Button::ButtonComponent.new(disabled: true) do %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "sm") %>
  <span class="ml-2">Loading...</span>
<% end %>
```

### In Badge

```erb
<%= render UI::Badge::BadgeComponent.new do %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "sm") %>
  <span class="ml-1.5">Processing</span>
<% end %>
```

### With Text

```erb
<div class="flex items-center gap-3">
  <%= render UI::Spinner::SpinnerComponent.new %>
  <span>Processing payment...</span>
</div>
```

### Centered with Message

```erb
<div class="flex flex-col items-center justify-center gap-4 p-8">
  <%= render UI::Spinner::SpinnerComponent.new(size: "lg") %>
  <div class="text-center">
    <div class="font-medium">Processing your request</div>
    <p class="text-sm text-muted-foreground">
      Please wait while we process your request.
    </p>
  </div>
</div>
```

### All Sizes Side by Side

```erb
<div class="flex items-center gap-4">
  <%= render UI::Spinner::SpinnerComponent.new(size: "sm") %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "default") %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "lg") %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "xl") %>
</div>
```

## Common Patterns

### Loading Button Pattern

```erb
<%# Disabled button with spinner %>
<%= render UI::Button::ButtonComponent.new(disabled: true) do %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "sm") %>
  <span class="ml-2">Please wait</span>
<% end %>
```

### Status Badge Pattern

```erb
<%# Badge with spinner for active status %>
<%= render UI::Badge::BadgeComponent.new(variant: "secondary") do %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "sm") %>
  <span class="ml-1.5">Syncing</span>
<% end %>
```

### Full Page Loading

```erb
<div class="flex h-screen items-center justify-center">
  <div class="flex flex-col items-center gap-4">
    <%= render UI::Spinner::SpinnerComponent.new(size: "xl") %>
    <p class="text-muted-foreground">Loading...</p>
  </div>
</div>
```

## Accessibility

- **ARIA**: Includes `role="status"` and `aria-label="Loading"` for screen readers
- **Visual**: Uses SVG with proper stroke and viewBox for crisp rendering at any size
- **Animation**: Pure CSS `animate-spin` - no JavaScript required

## Common Mistakes

### ❌ Wrong - Using Module Instead of Component

```erb
<%= render UI::Spinner.new %>
```

**Why it's wrong:** `UI::Spinner` is a module namespace, not the component class.

### ✅ Correct - Full Path to Component Class

```erb
<%= render UI::Spinner::SpinnerComponent.new %>
```

### ❌ Wrong - Missing <%= (Missing Equals Sign)

```erb
<% render UI::Spinner::SpinnerComponent.new %>
```

**Why it's wrong:** Without `=`, the spinner won't be output to the page.

### ✅ Correct - Use <%= to Output

```erb
<%= render UI::Spinner::SpinnerComponent.new %>
```

### ❌ Wrong - Using Symbol for Size

```erb
<%= render UI::Spinner::SpinnerComponent.new(size: :lg) %>
```

**Why it's wrong:** Size parameter expects a String, not a Symbol.

### ✅ Correct - String for Size

```erb
<%= render UI::Spinner::SpinnerComponent.new(size: "lg") %>
```

## Integration with Other Components

### Button Component

```erb
<%= render UI::Button::ButtonComponent.new(disabled: true) do %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "sm") %>
  <span class="ml-2">Loading</span>
<% end %>
```

### Badge Component

```erb
<%= render UI::Badge::BadgeComponent.new do %>
  <%= render UI::Spinner::SpinnerComponent.new(size: "sm") %>
  <span class="ml-1.5">Active</span>
<% end %>
```

### Card Component (Loading State)

```erb
<%= render UI::Card::CardComponent.new do %>
  <%= render UI::Card::CardContentComponent.new(classes: "flex items-center justify-center p-8") do %>
    <%= render UI::Spinner::SpinnerComponent.new(size: "lg") %>
  <% end %>
<% end %>
```

## See Also

- Phlex docs: `docs/llm/phlex/spinner.md`
- ERB docs: `docs/llm/erb/spinner.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/spinner
