# Input Group - Phlex

## Component Paths

```ruby
UI::InputGroup::InputGroup    # Main container
UI::InputGroup::Input          # Input element
UI::InputGroup::Textarea       # Textarea element
UI::InputGroup::Addon          # Addon container for icons, text, buttons
UI::InputGroup::Button         # Button within input group
UI::InputGroup::Text           # Text display within addon
```

## Description

A wrapper component for grouping inputs with addons, buttons, labels, and other elements.

## Basic Usage

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Input.new(placeholder: "Enter text")
end
```

## Sub-Components

### UI::InputGroup::InputGroup

Main wrapper container for the input group.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::InputGroup::Input

Replacement for standard Input with pre-applied styles for input groups.

**Parameters:**
- `placeholder:` String - Input placeholder text
- `type:` String - Input type (default: `"text"`)
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - All standard HTML input attributes

### UI::InputGroup::Textarea

Replacement for standard Textarea with pre-applied styles for input groups.

**Parameters:**
- `placeholder:` String - Textarea placeholder text
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - All standard HTML textarea attributes

### UI::InputGroup::Addon

Container for icons, text, buttons, or other content alongside the input.

**Parameters:**
- `align:` String - Alignment position
  - Options: `"inline-start"`, `"inline-end"`, `"block-start"`, `"block-end"`
  - Default: `"inline-start"`
  - Use `inline-start`/`inline-end` for inputs
  - Use `block-start`/`block-end` for textareas
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::InputGroup::Button

Button element specifically styled for use within input groups.

**Parameters:**
- `size:` String - Button size
  - Options: `"xs"`, `"sm"`, `"icon-xs"`, `"icon-sm"`
  - Default: `"xs"`
- `variant:` String - Button variant
  - Options: `"default"`, `"destructive"`, `"outline"`, `"secondary"`, `"ghost"`, `"link"`
  - Default: `"ghost"`
- `type:` String - Button type attribute (default: `"button"`)
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::InputGroup::Text

Text content display within addons (for currency symbols, protocols, domains, etc.).

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

## Examples

### Basic Input

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Input.new(placeholder: "Enter your email")
end
```

### With Icon Addon (inline-start)

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Addon.new(align: "inline-start") do
    svg(class: "size-4") { path(d: "M21 12a9 9 0 1 1-6.219-8.56") }
  end
  render UI::InputGroup::Input.new(placeholder: "Search...")
end
```

### With Text Addon (currency)

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Addon.new(align: "inline-start") do
    render UI::InputGroup::Text.new { "$" }
  end
  render UI::InputGroup::Input.new(type: "number", placeholder: "0.00")
end
```

### With Button Addon (inline-end)

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Input.new(placeholder: "Enter URL")
  render UI::InputGroup::Addon.new(align: "inline-end") do
    render UI::InputGroup::Button.new do
      svg(class: "size-3.5") { path(d: "...") }
    end
  end
end
```

### With Both Addons (prefix + suffix)

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Addon.new(align: "inline-start") do
    render UI::InputGroup::Text.new { "https://" }
  end
  render UI::InputGroup::Input.new(placeholder: "example.com")
  render UI::InputGroup::Addon.new(align: "inline-end") do
    render UI::InputGroup::Text.new { ".com" }
  end
end
```

### Textarea with Block Addon

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Textarea.new(placeholder: "Write your message", rows: 4)
  render UI::InputGroup::Addon.new(align: "block-end") do
    render UI::InputGroup::Button.new { "Send" }
  end
end
```

### With Label in Addon

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Addon.new(align: "block-start") do
    render UI::Label::Label.new(for: "email") { "Email address" }
  end
  render UI::InputGroup::Input.new(id: "email", placeholder: "you@example.com")
end
```

### With Multiple Buttons

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Input.new(placeholder: "Password")
  render UI::InputGroup::Addon.new(align: "inline-end") do
    render UI::InputGroup::Button.new(size: "icon-xs") do
      svg(class: "size-3.5") { path(d: "eye icon") }
    end
    render UI::InputGroup::Button.new(size: "icon-xs") do
      svg(class: "size-3.5") { path(d: "copy icon") }
    end
  end
end
```

## Common Patterns

### Search Input

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Addon.new(align: "inline-start") do
    svg(class: "size-4") { path(d: "search icon") }
  end
  render UI::InputGroup::Input.new(placeholder: "Search...")
  render UI::InputGroup::Addon.new(align: "inline-end") do
    render UI::Kbd::Kbd.new { "⌘K" }
  end
end
```

### Email Input

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Addon.new(align: "inline-start") do
    render UI::InputGroup::Text.new { "@" }
  end
  render UI::InputGroup::Input.new(type: "email", placeholder: "username")
end
```

### Amount Input

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Addon.new(align: "inline-start") do
    render UI::InputGroup::Text.new { "$" }
  end
  render UI::InputGroup::Input.new(type: "number", placeholder: "0.00")
  render UI::InputGroup::Addon.new(align: "inline-end") do
    render UI::InputGroup::Text.new { "USD" }
  end
end
```

## Accessibility

- Uses `role="group"` for proper grouping
- Includes `data-slot` attributes for focus management
- Supports `aria-invalid` for error states
- Maintains proper focus ring on input focus

## Common Mistakes

### ❌ Wrong - Using Module Instead of Component

```ruby
render UI::InputGroup.new
```

**Why it's wrong:** `UI::InputGroup` is a module namespace.

### ✅ Correct - Full Path to Component

```ruby
render UI::InputGroup::InputGroup.new
```

### ❌ Wrong - Using Symbol for Align

```ruby
render UI::InputGroup::Addon.new(align: :inline_start)
```

**Why it's wrong:** Align expects a String with hyphens.

### ✅ Correct - String with Hyphens

```ruby
render UI::InputGroup::Addon.new(align: "inline-start")
```

### ❌ Wrong - Wrong Addon Alignment for Textarea

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Textarea.new
  render UI::InputGroup::Addon.new(align: "inline-end")  # Wrong!
end
```

**Why it's wrong:** Textareas should use `block-start` or `block-end` alignment.

### ✅ Correct - Block Alignment for Textarea

```ruby
render UI::InputGroup::InputGroup.new do
  render UI::InputGroup::Textarea.new
  render UI::InputGroup::Addon.new(align: "block-end")
end
```

## Integration with Other Components

### With Button

```ruby
render UI::InputGroup::Addon.new(align: "inline-end") do
  render UI::InputGroup::Button.new { "Submit" }
end
```

### With Label

```ruby
render UI::InputGroup::Addon.new(align: "block-start") do
  render UI::Label::Label.new { "Email" }
end
```

### With Kbd (Keyboard Shortcut)

```ruby
render UI::InputGroup::Addon.new(align: "inline-end") do
  render UI::Kbd::Kbd.new { "⌘K" }
end
```

### With Spinner (Loading State)

```ruby
render UI::InputGroup::Addon.new(align: "inline-end") do
  render UI::Spinner::Spinner.new(size: "sm")
end
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/input-group
- ERB docs: `docs/llm/erb/input_group.md`
- ViewComponent docs: `docs/llm/vc/input_group.md`
