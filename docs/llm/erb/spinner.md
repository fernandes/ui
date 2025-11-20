# Spinner - ERB

## Component Path

```erb
<%= render "ui/spinner" %>
```

## Description

An indicator that can be used to show a loading state.

## Basic Usage

```erb
<%= render "ui/spinner" %>
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

- `classes:` String - Additional Tailwind CSS classes (commonly used for color)

- `attributes:` Hash - Any additional HTML attributes (id, data, aria, etc.)

## Examples

### Default

```erb
<%= render "ui/spinner" %>
```

### Size Variants

```erb
<%# Small spinner %>
<%= render "ui/spinner", size: "sm" %>

<%# Default spinner %>
<%= render "ui/spinner", size: "default" %>

<%# Large spinner %>
<%= render "ui/spinner", size: "lg" %>

<%# Extra large spinner %>
<%= render "ui/spinner", size: "xl" %>
```

### Color Variants

```erb
<%# Primary color %>
<%= render "ui/spinner", classes: "text-primary" %>

<%# Blue spinner %>
<%= render "ui/spinner", classes: "text-blue-500" %>

<%# Red spinner %>
<%= render "ui/spinner", classes: "text-red-500" %>

<%# Green spinner %>
<%= render "ui/spinner", classes: "text-green-500" %>
```

### In Button (Loading State)

```erb
<%= render "ui/button", disabled: true do %>
  <%= render "ui/spinner", size: "sm" %>
  <span class="ml-2">Loading...</span>
<% end %>
```

### In Badge

```erb
<%= render "ui/badge/badge" do %>
  <%= render "ui/spinner", size: "sm" %>
  <span class="ml-1.5">Processing</span>
<% end %>
```

### With Text

```erb
<div class="flex items-center gap-3">
  <%= render "ui/spinner" %>
  <span>Processing payment...</span>
</div>
```

### Centered with Message

```erb
<div class="flex flex-col items-center justify-center gap-4 p-8">
  <%= render "ui/spinner", size: "lg" %>
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
  <%= render "ui/spinner", size: "sm" %>
  <%= render "ui/spinner", size: "default" %>
  <%= render "ui/spinner", size: "lg" %>
  <%= render "ui/spinner", size: "xl" %>
</div>
```

## Common Patterns

### Loading Button Pattern

```erb
<%# Disabled button with spinner %>
<%= render "ui/button", disabled: true do %>
  <%= render "ui/spinner", size: "sm" %>
  <span class="ml-2">Please wait</span>
<% end %>
```

### Status Badge Pattern

```erb
<%# Badge with spinner for active status %>
<%= render "ui/badge/badge", variant: "secondary" do %>
  <%= render "ui/spinner", size: "sm" %>
  <span class="ml-1.5">Syncing</span>
<% end %>
```

### Full Page Loading

```erb
<div class="flex h-screen items-center justify-center">
  <div class="flex flex-col items-center gap-4">
    <%= render "ui/spinner", size: "xl" %>
    <p class="text-muted-foreground">Loading...</p>
  </div>
</div>
```

## Accessibility

- **ARIA**: Includes `role="status"` and `aria-label="Loading"` for screen readers
- **Visual**: Uses SVG with proper stroke and viewBox for crisp rendering at any size
- **Animation**: Pure CSS `animate-spin` - no JavaScript required

## Common Mistakes

### ❌ Wrong - Missing <%= (Missing Equals Sign)

```erb
<% render "ui/spinner" %>
```

**Why it's wrong:** Without `=`, the spinner won't be output to the page.

### ✅ Correct - Use <%= to Output

```erb
<%= render "ui/spinner" %>
```

### ❌ Wrong - Using Symbol for Size

```erb
<%= render "ui/spinner", size: :lg %>
```

**Why it's wrong:** Size parameter expects a String, not a Symbol.

### ✅ Correct - String for Size

```erb
<%= render "ui/spinner", size: "lg" %>
```

### ❌ Wrong - Nested attributes incorrectly

```erb
<%= render "ui/spinner", id: "my-spinner", data: { test: "value" } %>
```

**Why it's wrong:** Extra attributes should be wrapped in `attributes:` hash.

### ✅ Correct - Use attributes Hash

```erb
<%= render "ui/spinner", attributes: { id: "my-spinner", data: { test: "value" } } %>
```

## Integration with Other Components

### Button Component

```erb
<%= render "ui/button", disabled: true do %>
  <%= render "ui/spinner", size: "sm" %>
  <span class="ml-2">Loading</span>
<% end %>
```

### Badge Component

```erb
<%= render "ui/badge/badge" do %>
  <%= render "ui/spinner", size: "sm" %>
  <span class="ml-1.5">Active</span>
<% end %>
```

### Card Component (Loading State)

```erb
<%= render "ui/card/card" do %>
  <%= render "ui/card/card_content", classes: "flex items-center justify-center p-8" do %>
    <%= render "ui/spinner", size: "lg" %>
  <% end %>
<% end %>
```

## See Also

- Phlex docs: `docs/llm/phlex/spinner.md`
- ViewComponent docs: `docs/llm/vc/spinner.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/spinner
