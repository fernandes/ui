# Separator - Phlex

## Component Path

```ruby
UI::Separator::Separator
```

## Description

Visually or semantically separates content.

## Basic Usage

```ruby
render UI::Separator::Separator.new
```

## Parameters

### Required

None

### Optional

- `orientation:` Symbol - Direction of the separator
  - Options: `:horizontal`, `:vertical`
  - Default: `:horizontal`

- `decorative:` Boolean - Whether the separator is purely decorative or has semantic meaning
  - When `true`, the separator is purely visual (no ARIA role)
  - When `false`, the separator has semantic meaning (role="separator" with aria-orientation)
  - Default: `true`

- `classes:` String - Additional Tailwind CSS classes

- `**attributes` Hash - Any additional HTML attributes (id, data, aria, etc.)

## Examples

### Horizontal Separator (Default)

```ruby
div(class: "space-y-1") do
  h4(class: "text-sm leading-none font-medium") { "Radix Primitives" }
  p(class: "text-muted-foreground text-sm") { "An open-source UI component library." }
end
render UI::Separator::Separator.new(classes: "my-4")
div(class: "flex h-5 items-center space-x-4 text-sm") do
  div { "Blog" }
  div { "Docs" }
  div { "Source" }
end
```

### Vertical Separator

```ruby
div(class: "flex h-5 items-center space-x-4 text-sm") do
  div { "Blog" }
  render UI::Separator::Separator.new(orientation: :vertical)
  div { "Docs" }
  render UI::Separator::Separator.new(orientation: :vertical)
  div { "Source" }
end
```

### Semantic Separator (for Screen Readers)

```ruby
# When the separator has semantic meaning for screen readers
render UI::Separator::Separator.new(decorative: false, classes: "my-4")
```

### With Custom Styling

```ruby
render UI::Separator::Separator.new(classes: "my-8 bg-red-500")
```

## Common Patterns

### In Navigation

```ruby
nav(class: "flex items-center space-x-4") do
  a(href: "/home") { "Home" }
  render UI::Separator::Separator.new(orientation: :vertical, classes: "h-4")
  a(href: "/about") { "About" }
  render UI::Separator::Separator.new(orientation: :vertical, classes: "h-4")
  a(href: "/contact") { "Contact" }
end
```

### Between Sections

```ruby
section do
  h2 { "Section 1" }
  p { "Content for section 1" }
end

render UI::Separator::Separator.new(classes: "my-6")

section do
  h2 { "Section 2" }
  p { "Content for section 2" }
end
```

## Accessibility

- **ARIA**: When `decorative: false`, adds `role="separator"` and `aria-orientation` attributes for screen readers
- **Visual**: Uses sufficient color contrast via `bg-border` theme variable

## Common Mistakes

### ❌ Wrong: Using divider classes manually

```ruby
div(class: "h-px w-full bg-gray-300 my-4")
```

**Why it's wrong:** Doesn't respect theme colors, lacks accessibility attributes, and duplicates styling logic.

### ✅ Correct: Use Separator component

```ruby
render UI::Separator::Separator.new(classes: "my-4")
```

### ❌ Wrong: Trying to add content inside separator

```ruby
render UI::Separator::Separator.new do
  "Text"  # This won't work!
end
```

**Why it's wrong:** Separator is a self-closing component (renders a `<div>` without content).

### ✅ Correct: Separator is self-closing

```ruby
render UI::Separator::Separator.new
```

## Integration with Other Components

### With Cards

```ruby
render UI::Card::Card.new do
  render UI::Card::Header.new do
    render UI::Card::Title.new { "Card Title" }
  end

  render UI::Separator::Separator.new

  render UI::Card::Content.new do
    p { "Card content goes here" }
  end
end
```

### With Menus

```ruby
render UI::DropdownMenu::Content.new do
  render UI::DropdownMenu::Item.new { "Profile" }
  render UI::DropdownMenu::Item.new { "Settings" }

  render UI::Separator::Separator.new(classes: "my-1")

  render UI::DropdownMenu::Item.new { "Logout" }
end
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/separator
- Radix UI: https://www.radix-ui.com/primitives/docs/components/separator
