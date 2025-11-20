# Spinner - Phlex

## Component Path

```ruby
UI::Spinner::Spinner
```

## Description

An indicator that can be used to show a loading state.

## Basic Usage

```ruby
render UI::Spinner::Spinner.new
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

```ruby
render UI::Spinner::Spinner.new
```

### Size Variants

```ruby
# Small spinner
render UI::Spinner::Spinner.new(size: "sm")

# Default spinner
render UI::Spinner::Spinner.new(size: "default")

# Large spinner
render UI::Spinner::Spinner.new(size: "lg")

# Extra large spinner
render UI::Spinner::Spinner.new(size: "xl")
```

### Color Variants

```ruby
# Primary color
render UI::Spinner::Spinner.new(classes: "text-primary")

# Blue spinner
render UI::Spinner::Spinner.new(classes: "text-blue-500")

# Red spinner
render UI::Spinner::Spinner.new(classes: "text-red-500")

# Green spinner
render UI::Spinner::Spinner.new(classes: "text-green-500")
```

### In Button (Loading State)

```ruby
render UI::Button::Button.new(disabled: true) do
  render UI::Spinner::Spinner.new(size: "sm")
  plain " Loading..."
end
```

### In Badge

```ruby
render UI::Badge::Badge.new do
  render UI::Spinner::Spinner.new(size: "sm")
  plain " Processing"
end
```

### With Text

```ruby
div class: "flex items-center gap-3" do
  render UI::Spinner::Spinner.new
  span { "Processing payment..." }
end
```

### Centered with Message

```ruby
div class: "flex flex-col items-center justify-center gap-4 p-8" do
  render UI::Spinner::Spinner.new(size: "lg")
  div class: "text-center" do
    div(class: "font-medium") { "Processing your request" }
    p(class: "text-sm text-muted-foreground") do
      "Please wait while we process your request."
    end
  end
end
```

## Common Patterns

### Loading Button Pattern

```ruby
# Disabled button with spinner
render UI::Button::Button.new(disabled: true) do
  render UI::Spinner::Spinner.new(size: "sm")
  plain " Please wait"
end
```

### Status Badge Pattern

```ruby
# Badge with spinner for active status
render UI::Badge::Badge.new(variant: "secondary") do
  render UI::Spinner::Spinner.new(size: "sm")
  plain " Syncing"
end
```

### Full Page Loading

```ruby
div class: "flex h-screen items-center justify-center" do
  div class: "flex flex-col items-center gap-4" do
    render UI::Spinner::Spinner.new(size: "xl")
    p(class: "text-muted-foreground") { "Loading..." }
  end
end
```

## Accessibility

- **ARIA**: Includes `role="status"` and `aria-label="Loading"` for screen readers
- **Visual**: Uses SVG with proper stroke and viewBox for crisp rendering at any size
- **Animation**: Pure CSS `animate-spin` - no JavaScript required

## Common Mistakes

### ❌ Wrong - Using Module Instead of Component

```ruby
render UI::Spinner.new
```

**Why it's wrong:** `UI::Spinner` is a module namespace, not the component class.

### ✅ Correct - Full Path to Component

```ruby
render UI::Spinner::Spinner.new
```

### ❌ Wrong - Symbol for Size

```ruby
render UI::Spinner::Spinner.new(size: :lg)
```

**Why it's wrong:** Size parameter expects a String, not a Symbol.

### ✅ Correct - String for Size

```ruby
render UI::Spinner::Spinner.new(size: "lg")
```

## Integration with Other Components

### Button Component

```ruby
render UI::Button::Button.new(disabled: true) do
  render UI::Spinner::Spinner.new(size: "sm")
  plain " Loading"
end
```

### Badge Component

```ruby
render UI::Badge::Badge.new do
  render UI::Spinner::Spinner.new(size: "sm")
  plain " Active"
end
```

### Card Component (Loading State)

```ruby
render UI::Card::Card.new do
  render UI::Card::CardContent.new(classes: "flex items-center justify-center p-8") do
    render UI::Spinner::Spinner.new(size: "lg")
  end
end
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/spinner
- ERB docs: `docs/llm/erb/spinner.md`
- ViewComponent docs: `docs/llm/vc/spinner.md`
