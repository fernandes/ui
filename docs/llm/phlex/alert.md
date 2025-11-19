# Alert - Phlex

## Component Path

```ruby
UI::Alert::{SubComponent}
```

## Description

A callout component for displaying important messages, notifications, or information to users. The Alert component is non-interactive and provides a visually distinct way to present status updates, warnings, or success messages.

Based on [shadcn/ui Alert](https://ui.shadcn.com/docs/components/alert).

## Basic Usage

```ruby
render UI::Alert::Alert.new do
  # Optional icon (SVG)
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    stroke_width: "2",
    stroke_linecap: "round",
    stroke_linejoin: "round",
    class: "lucide lucide-circle-check"
  ) do
    circle(cx: "12", cy: "12", r: "10")
    path(d: "m9 12 2 2 4-4")
  end

  render UI::Alert::Title.new { "Success" }
  render UI::Alert::Description.new { "Your changes have been saved successfully." }
end
```

## Sub-Components

### UI::Alert::Alert

Main container that wraps the alert content. Provides variant styling and icon support.

**Parameters:**
- `variant:` Symbol - Visual style variant
  - Options: `:default`, `:destructive`
  - Default: `:default`
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```ruby
render UI::Alert::Alert.new(variant: :default) do
  # Alert content
end
```

### UI::Alert::Title

Title text for the alert. Renders as a div with proper styling.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes

**Example:**
```ruby
render UI::Alert::Title.new { "Important Notice" }
```

### UI::Alert::Description

Description text for the alert. Supports paragraphs and nested content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes

**Example:**
```ruby
render UI::Alert::Description.new do
  "Your account has been successfully updated with the new settings."
end
```

## Variants

### Default

Standard informational alert with neutral styling.

```ruby
render UI::Alert::Alert.new(variant: :default) do
  render UI::Alert::Title.new { "Heads up!" }
  render UI::Alert::Description.new do
    "You can add components to your app using the CLI."
  end
end
```

### Destructive

Error or warning alert with red/destructive styling.

```ruby
render UI::Alert::Alert.new(variant: :destructive) do
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    stroke_width: "2",
    stroke_linecap: "round",
    stroke_linejoin: "round",
    class: "lucide lucide-circle-alert"
  ) do
    circle(cx: "12", cy: "12", r: "10")
    path(d: "M12 8v4")
    path(d: "M12 16h.01")
  end

  render UI::Alert::Title.new { "Error" }
  render UI::Alert::Description.new do
    "Your session has expired. Please log in again."
  end
end
```

## Examples

### Simple Text Alert

```ruby
render UI::Alert::Alert.new do
  render UI::Alert::Title.new { "Note" }
  render UI::Alert::Description.new do
    "This feature is currently in beta."
  end
end
```

### Alert with Icon

```ruby
render UI::Alert::Alert.new do
  # Check circle icon
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    stroke_width: "2",
    stroke_linecap: "round",
    stroke_linejoin: "round",
    class: "lucide lucide-circle-check"
  ) do
    circle(cx: "12", cy: "12", r: "10")
    path(d: "m9 12 2 2 4-4")
  end

  render UI::Alert::Title.new { "Success" }
  render UI::Alert::Description.new do
    "Your changes have been saved."
  end
end
```

### Destructive Alert with Icon

```ruby
render UI::Alert::Alert.new(variant: :destructive) do
  # Alert circle icon
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    stroke_width: "2",
    stroke_linecap: "round",
    stroke_linejoin: "round",
    class: "lucide lucide-circle-alert"
  ) do
    circle(cx: "12", cy: "12", r: "10")
    path(d: "M12 8v4")
    path(d: "M12 16h.01")
  end

  render UI::Alert::Title.new { "Error" }
  render UI::Alert::Description.new do
    "Something went wrong. Please try again."
  end
end
```

### Alert with Custom Styling

```ruby
render UI::Alert::Alert.new(classes: "border-blue-500") do
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    stroke_width: "2",
    stroke_linecap: "round",
    stroke_linejoin: "round",
    class: "lucide lucide-info"
  ) do
    circle(cx: "12", cy: "12", r: "10")
    path(d: "M12 16v-4")
    path(d: "M12 8h.01")
  end

  render UI::Alert::Title.new(classes: "text-blue-600") { "Information" }
  render UI::Alert::Description.new(classes: "text-blue-800") do
    "This is a custom styled alert with blue accents."
  end
end
```

### Alert Without Title

```ruby
render UI::Alert::Alert.new do
  render UI::Alert::Description.new do
    "This is a simple notification without a title."
  end
end
```

## Common Patterns

### Success Notification

```ruby
render UI::Alert::Alert.new do
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    stroke_width: "2",
    class: "lucide lucide-circle-check"
  ) do
    circle(cx: "12", cy: "12", r: "10")
    path(d: "m9 12 2 2 4-4")
  end

  render UI::Alert::Title.new { "Success" }
  render UI::Alert::Description.new do
    "Operation completed successfully."
  end
end
```

### Warning Message

```ruby
render UI::Alert::Alert.new(variant: :destructive) do
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    stroke_width: "2",
    class: "lucide lucide-triangle-alert"
  ) do
    path(d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z")
    path(d: "M12 9v4")
    path(d: "M12 17h.01")
  end

  render UI::Alert::Title.new { "Warning" }
  render UI::Alert::Description.new do
    "This action cannot be undone. Please proceed with caution."
  end
end
```

### Info Message

```ruby
render UI::Alert::Alert.new do
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    stroke_width: "2",
    class: "lucide lucide-info"
  ) do
    circle(cx: "12", cy: "12", r: "10")
    path(d: "M12 16v-4")
    path(d: "M12 8h.01")
  end

  render UI::Alert::Title.new { "Did you know?" }
  render UI::Alert::Description.new do
    "You can use keyboard shortcuts to navigate faster."
  end
end
```

## Common Mistakes

### ❌ Wrong - Forgetting to render sub-components

```ruby
render UI::Alert::Alert.new do
  "This text won't be styled properly"
end
```

**Why it's wrong:** The Alert container expects Title and Description components for proper styling.

### ✅ Correct - Always use Title and/or Description

```ruby
render UI::Alert::Alert.new do
  render UI::Alert::Title.new { "Title" }
  render UI::Alert::Description.new { "Description text" }
end
```

### ❌ Wrong - Using string for variant

```ruby
render UI::Alert::Alert.new(variant: "destructive") do
  # Won't work - variant must be a symbol
end
```

**Why it's wrong:** Variant parameter must be a symbol, not a string.

### ✅ Correct - Use symbols for variants

```ruby
render UI::Alert::Alert.new(variant: :destructive) do
  # This works correctly
end
```

### ❌ Wrong - Nesting alerts

```ruby
render UI::Alert::Alert.new do
  render UI::Alert::Alert.new do
    # Don't nest alerts
  end
end
```

**Why it's wrong:** Alerts are meant to be standalone components. Nesting doesn't make semantic sense.

### ✅ Correct - Use multiple alerts side by side

```ruby
render UI::Alert::Alert.new do
  render UI::Alert::Title.new { "First alert" }
end

render UI::Alert::Alert.new do
  render UI::Alert::Title.new { "Second alert" }
end
```

## Accessibility

**Semantic HTML:**
- Uses `role="alert"` attribute
- Properly announces content to screen readers

**Visual Indicators:**
- Icons provide visual context
- Color variants convey meaning
- Text content provides clear messaging

**Best Practices:**
- Always include descriptive text
- Use appropriate variant for context
- Provide icons when possible for visual users

## See Also

- Phlex guide: `docs/llm/phlex.md`
- ERB implementation: `docs/llm/erb/alert.md`
- ViewComponent implementation: `docs/llm/vc/alert.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/alert
