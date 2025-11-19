# Badge - Phlex

## Component Path

```ruby
UI::Badge::Badge
```

## Description

Displays a badge or a component that looks like a badge. Badges are small labeled indicators used for statuses, categories, tags, or counts.

Based on [shadcn/ui Badge](https://ui.shadcn.com/docs/components/badge).

## Basic Usage

```ruby
render UI::Badge::Badge.new { "Badge" }
```

## Parameters

### UI::Badge::Badge

**Parameters:**
- `variant:` Symbol or String - Visual style variant (default: `:default`)
  - `:default` - Primary background with foreground text
  - `:secondary` - Secondary background styling
  - `:destructive` - Danger/error state
  - `:outline` - Border-based style with transparent background
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```ruby
render UI::Badge::Badge.new(variant: :destructive) { "Error" }
```

## Examples

### Default Badge

```ruby
render UI::Badge::Badge.new { "Badge" }
```

### Variant Badges

```ruby
# Secondary variant
render UI::Badge::Badge.new(variant: :secondary) { "Secondary" }

# Destructive variant
render UI::Badge::Badge.new(variant: :destructive) { "Destructive" }

# Outline variant
render UI::Badge::Badge.new(variant: :outline) { "Outline" }
```

### Badge as Link

```ruby
a(href: "/notifications", class: "no-underline") do
  render UI::Badge::Badge.new { "5" }
end
```

### Badge with Icon

```ruby
render UI::Badge::Badge.new do
  svg(
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    class: "size-3"
  ) do
    path(
      fill_rule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
      clip_rule: "evenodd"
    )
  end
  plain " Verified"
end
```

### Notification Count

```ruby
div(class: "flex items-center gap-2") do
  plain "Inbox"
  render UI::Badge::Badge.new(classes: "h-5 min-w-5 font-mono tabular-nums") { "12" }
end
```

### Pill Badge

```ruby
render UI::Badge::Badge.new(classes: "rounded-full px-1") { "New" }
```

### Status Indicators

```ruby
div(class: "flex gap-2") do
  render UI::Badge::Badge.new(variant: :default) { "Active" }
  render UI::Badge::Badge.new(variant: :secondary) { "Pending" }
  render UI::Badge::Badge.new(variant: :outline) { "Draft" }
  render UI::Badge::Badge.new(variant: :destructive) { "Archived" }
end
```

### Category Tags

```ruby
div(class: "flex flex-wrap gap-2") do
  ["React", "TypeScript", "Tailwind", "Next.js"].each do |tag|
    render UI::Badge::Badge.new(variant: :outline) { tag }
  end
end
```

### User Role Badge

```ruby
div(class: "flex items-center gap-2") do
  plain "John Doe"
  render UI::Badge::Badge.new(variant: :secondary, classes: "text-[10px]") { "Admin" }
end
```

### Removable Badge

```ruby
render UI::Badge::Badge.new(variant: :secondary, classes: "gap-1") do
  plain "Filter"
  button(
    type: "button",
    class: "ml-0.5 hover:bg-secondary-foreground/10 rounded-sm p-0.5",
    "data-action": "click->badge#remove"
  ) do
    svg(
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      class: "size-3"
    ) do
      path(d: "M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z")
    end
  end
end
```

### Badge in Card Header

```ruby
div(class: "rounded-lg border bg-card p-4") do
  div(class: "flex items-center justify-between") do
    h3(class: "font-semibold") { "Project Name" }
    render UI::Badge::Badge.new(variant: :default) { "In Progress" }
  end
  p(class: "text-sm text-muted-foreground mt-2") { "Project description goes here" }
end
```

## Common Patterns

### Notification Badge on Avatar

```ruby
div(class: "relative inline-block") do
  # Avatar
  div(class: "size-10 rounded-full bg-muted")

  # Badge notification
  render UI::Badge::Badge.new(
    classes: "absolute -top-1 -right-1 h-5 min-w-5 p-0 text-[10px]"
  ) { "3" }
end
```

### Status with Color

```ruby
div(class: "flex items-center gap-2") do
  div(class: "size-2 rounded-full bg-green-500")
  render UI::Badge::Badge.new(variant: :outline) { "Online" }
end
```

### Badge Group

```ruby
div(class: "flex flex-wrap items-center gap-2") do
  span(class: "text-sm font-medium") { "Tags:" }
  render UI::Badge::Badge.new(variant: :secondary) { "Design" }
  render UI::Badge::Badge.new(variant: :secondary) { "Development" }
  render UI::Badge::Badge.new(variant: :secondary) { "Marketing" }
end
```

## Variant Reference

| Variant | Use Case | Appearance |
|---------|----------|------------|
| `:default` | Primary status, featured items | Primary background, high contrast |
| `:secondary` | Secondary status, metadata | Secondary background, medium contrast |
| `:destructive` | Errors, warnings, deletion | Red/destructive background |
| `:outline` | Subtle tags, filters | Border only, transparent background |

## Common Mistakes

### ❌ Wrong - Not using symbol for variant

```ruby
render UI::Badge::Badge.new(variant: "destructive") { "Error" }
# Works but symbol is preferred
```

**Why it's not ideal:** Symbols are more idiomatic in Ruby and slightly more performant.

### ✅ Correct - Use symbol for variant

```ruby
render UI::Badge::Badge.new(variant: :destructive) { "Error" }
```

### ❌ Wrong - Using badge as button

```ruby
render UI::Badge::Badge.new(onclick: "handleClick()") { "Click me" }
```

**Why it's wrong:** Badges are not interactive elements. Use a button with badge styling instead.

### ✅ Correct - Wrap in button if interactive

```ruby
button(type: "button", class: "focus:outline-none") do
  render UI::Badge::Badge.new { "Click me" }
end
```

### ❌ Wrong - Too much text in badge

```ruby
render UI::Badge::Badge.new { "This is a very long text that doesn't fit" }
```

**Why it's wrong:** Badges are meant for short, concise labels.

### ✅ Correct - Keep text short

```ruby
render UI::Badge::Badge.new { "New" }
```

## Accessibility

**Semantic HTML:**
- Badge uses `<span>` by default, which is appropriate for non-interactive labels
- For interactive badges (links), wrap in `<a>` tag
- For removable badges, use proper button elements

**Screen Readers:**
- Ensure badge text is meaningful on its own
- For decorative badges, consider `aria-hidden="true"`
- For notification counts, consider `aria-label` with context

**Keyboard Navigation:**
- Badges themselves are not focusable
- If wrapped in interactive elements, ensure proper focus states
- Use `focus-visible:` utilities for keyboard focus indicators

## See Also

- Phlex guide: `docs/llm/phlex.md`
- ERB implementation: `docs/llm/erb/badge.md`
- ViewComponent implementation: `docs/llm/vc/badge.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/badge
