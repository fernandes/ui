# Separator - ViewComponent

## Component Path

```ruby
UI::Separator::SeparatorComponent
```

## Description

Visually or semantically separates content.

## Basic Usage

```erb
<%= render UI::Separator::SeparatorComponent.new %>
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

```erb
<div class="space-y-1">
  <h4 class="text-sm leading-none font-medium">Radix Primitives</h4>
  <p class="text-muted-foreground text-sm">An open-source UI component library.</p>
</div>
<%= render UI::Separator::SeparatorComponent.new(classes: "my-4") %>
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <div>Docs</div>
  <div>Source</div>
</div>
```

### Vertical Separator

```erb
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <%= render UI::Separator::SeparatorComponent.new(orientation: :vertical) %>
  <div>Docs</div>
  <%= render UI::Separator::SeparatorComponent.new(orientation: :vertical) %>
  <div>Source</div>
</div>
```

### Semantic Separator (for Screen Readers)

```erb
<%# When the separator has semantic meaning for screen readers %>
<%= render UI::Separator::SeparatorComponent.new(decorative: false, classes: "my-4") %>
```

### With Custom Styling

```erb
<%= render UI::Separator::SeparatorComponent.new(classes: "my-8 bg-red-500") %>
```

## Common Patterns

### In Navigation

```erb
<nav class="flex items-center space-x-4">
  <a href="/home">Home</a>
  <%= render UI::Separator::SeparatorComponent.new(orientation: :vertical, classes: "h-4") %>
  <a href="/about">About</a>
  <%= render UI::Separator::SeparatorComponent.new(orientation: :vertical, classes: "h-4") %>
  <a href="/contact">Contact</a>
</nav>
```

### Between Sections

```erb
<section>
  <h2>Section 1</h2>
  <p>Content for section 1</p>
</section>

<%= render UI::Separator::SeparatorComponent.new(classes: "my-6") %>

<section>
  <h2>Section 2</h2>
  <p>Content for section 2</p>
</section>
```

## Accessibility

- **ARIA**: When `decorative: false`, adds `role="separator"` and `aria-orientation` attributes for screen readers
- **Visual**: Uses sufficient color contrast via `bg-border` theme variable

## Common Mistakes

### ❌ Wrong: Using divider classes manually

```erb
<div class="h-px w-full bg-gray-300 my-4"></div>
```

**Why it's wrong:** Doesn't respect theme colors, lacks accessibility attributes, and duplicates styling logic.

### ✅ Correct: Use Separator component

```erb
<%= render UI::Separator::SeparatorComponent.new(classes: "my-4") %>
```

### ❌ Wrong: Trying to add content inside separator

```erb
<%= render UI::Separator::SeparatorComponent.new do %>
  Text
<% end %>
```

**Why it's wrong:** Separator is a self-closing component (renders a `<div>` without content).

### ✅ Correct: Separator is self-closing

```erb
<%= render UI::Separator::SeparatorComponent.new %>
```

### ❌ Wrong: Using module instead of component class

```erb
<%= render UI::Separator.new %>
```

**Why it's wrong:** `UI::Separator` is a module, not a component. You need to use the full component class name.

### ✅ Correct: Use full component class name

```erb
<%= render UI::Separator::SeparatorComponent.new %>
```

### ❌ Wrong: Missing = in ERB tag

```erb
<% render UI::Separator::SeparatorComponent.new %>
```

**Why it's wrong:** Without `=`, the component won't be rendered to the page.

### ✅ Correct: Use <%= to Output

```erb
<%= render UI::Separator::SeparatorComponent.new %>
```

### ❌ Wrong: String instead of Symbol

```erb
<%= render UI::Separator::SeparatorComponent.new(orientation: "vertical") %>
```

**Why it's wrong:** While it might work due to Ruby's type coercion, symbols are preferred for enum-like values.

### ✅ Correct: Use Symbol

```erb
<%= render UI::Separator::SeparatorComponent.new(orientation: :vertical) %>
```

## Integration with Other Components

### With Cards

```erb
<%= render UI::Card::CardComponent.new do %>
  <%= render UI::Card::HeaderComponent.new do %>
    <%= render UI::Card::TitleComponent.new do %>
      Card Title
    <% end %>
  <% end %>

  <%= render UI::Separator::SeparatorComponent.new %>

  <%= render UI::Card::ContentComponent.new do %>
    <p>Card content goes here</p>
  <% end %>
<% end %>
```

### With Menus

```erb
<%= render UI::DropdownMenu::ContentComponent.new do %>
  <%= render UI::DropdownMenu::ItemComponent.new do %>Profile<% end %>
  <%= render UI::DropdownMenu::ItemComponent.new do %>Settings<% end %>

  <%= render UI::Separator::SeparatorComponent.new(classes: "my-1") %>

  <%= render UI::DropdownMenu::ItemComponent.new do %>Logout<% end %>
<% end %>
```

## See Also

- Phlex docs: `docs/llm/phlex/separator.md`
- ERB docs: `docs/llm/erb/separator.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/separator
- Radix UI: https://www.radix-ui.com/primitives/docs/components/separator
