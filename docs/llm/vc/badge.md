# Badge - ViewComponent

## Component Path

```ruby
UI::Badge::BadgeComponent
```

## Description

Displays a badge or a component that looks like a badge. Badges are small labeled indicators used for statuses, categories, tags, or counts.

Based on [shadcn/ui Badge](https://ui.shadcn.com/docs/components/badge).

## Basic Usage

```erb
<%= render(UI::Badge::BadgeComponent.new) { "Badge" } %>
```

## Parameters

### UI::Badge::BadgeComponent

**Parameters:**
- `variant:` Symbol or String - Visual style variant (default: `:default`)
  - `:default` - Primary background with foreground text
  - `:secondary` - Secondary background styling
  - `:destructive` - Danger/error state
  - `:outline` - Border-based style with transparent background
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```erb
<%= render(UI::Badge::BadgeComponent.new(variant: :destructive)) { "Error" } %>
```

## Examples

### Default Badge

```erb
<%= render(UI::Badge::BadgeComponent.new) { "Badge" } %>
```

### Variant Badges

```erb
<%# Secondary variant %>
<%= render(UI::Badge::BadgeComponent.new(variant: :secondary)) { "Secondary" } %>

<%# Destructive variant %>
<%= render(UI::Badge::BadgeComponent.new(variant: :destructive)) { "Destructive" } %>

<%# Outline variant %>
<%= render(UI::Badge::BadgeComponent.new(variant: :outline)) { "Outline" } %>
```

### Badge as Link

```erb
<%= link_to "/notifications", class: "no-underline" do %>
  <%= render(UI::Badge::BadgeComponent.new) { "5" } %>
<% end %>
```

### Badge with Icon

```erb
<%= render(UI::Badge::BadgeComponent.new) do %>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
  </svg>
  Verified
<% end %>
```

### Notification Count

```erb
<div class="flex items-center gap-2">
  Inbox
  <%= render(UI::Badge::BadgeComponent.new(classes: "h-5 min-w-5 font-mono tabular-nums")) { "12" } %>
</div>
```

### Pill Badge

```erb
<%= render(UI::Badge::BadgeComponent.new(classes: "rounded-full px-1")) { "New" } %>
```

### Status Indicators

```erb
<div class="flex gap-2">
  <%= render(UI::Badge::BadgeComponent.new(variant: :default)) { "Active" } %>
  <%= render(UI::Badge::BadgeComponent.new(variant: :secondary)) { "Pending" } %>
  <%= render(UI::Badge::BadgeComponent.new(variant: :outline)) { "Draft" } %>
  <%= render(UI::Badge::BadgeComponent.new(variant: :destructive)) { "Archived" } %>
</div>
```

### Category Tags

```erb
<div class="flex flex-wrap gap-2">
  <% ["React", "TypeScript", "Tailwind", "Next.js"].each do |tag| %>
    <%= render(UI::Badge::BadgeComponent.new(variant: :outline)) { tag } %>
  <% end %>
</div>
```

### User Role Badge

```erb
<div class="flex items-center gap-2">
  John Doe
  <%= render(UI::Badge::BadgeComponent.new(variant: :secondary, classes: "text-[10px]")) { "Admin" } %>
</div>
```

### Removable Badge

```erb
<%= render(UI::Badge::BadgeComponent.new(variant: :secondary, classes: "gap-1")) do %>
  Filter
  <button type="button" class="ml-0.5 hover:bg-secondary-foreground/10 rounded-sm p-0.5" data-action="click->badge#remove">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  </button>
<% end %>
```

### Badge in Card Header

```erb
<div class="rounded-lg border bg-card p-4">
  <div class="flex items-center justify-between">
    <h3 class="font-semibold">Project Name</h3>
    <%= render(UI::Badge::BadgeComponent.new(variant: :default)) { "In Progress" } %>
  </div>
  <p class="text-sm text-muted-foreground mt-2">Project description goes here</p>
</div>
```

## Common Patterns

### Notification Badge on Avatar

```erb
<div class="relative inline-block">
  <%# Avatar %>
  <div class="size-10 rounded-full bg-muted"></div>

  <%# Badge notification %>
  <%= render(UI::Badge::BadgeComponent.new(
    classes: "absolute -top-1 -right-1 h-5 min-w-5 p-0 text-[10px]"
  )) { "3" } %>
</div>
```

### Status with Color

```erb
<div class="flex items-center gap-2">
  <div class="size-2 rounded-full bg-green-500"></div>
  <%= render(UI::Badge::BadgeComponent.new(variant: :outline)) { "Online" } %>
</div>
```

### Badge Group

```erb
<div class="flex flex-wrap items-center gap-2">
  <span class="text-sm font-medium">Tags:</span>
  <%= render(UI::Badge::BadgeComponent.new(variant: :secondary)) { "Design" } %>
  <%= render(UI::Badge::BadgeComponent.new(variant: :secondary)) { "Development" } %>
  <%= render(UI::Badge::BadgeComponent.new(variant: :secondary)) { "Marketing" } %>
</div>
```

### Dynamic Badges from Collection

```erb
<div class="flex flex-wrap gap-2">
  <% @tags.each do |tag| %>
    <%= render(UI::Badge::BadgeComponent.new(variant: :outline)) { tag.name } %>
  <% end %>
</div>
```

## Variant Reference

| Variant | Use Case | Appearance |
|---------|----------|------------|
| `:default` | Primary status, featured items | Primary background, high contrast |
| `:secondary` | Secondary status, metadata | Secondary background, medium contrast |
| `:destructive` | Errors, warnings, deletion | Red/destructive background |
| `:outline` | Subtle tags, filters | Border only, transparent background |

## Common Mistakes

### ❌ Wrong - Missing parentheses in render

```erb
<%= render UI::Badge::BadgeComponent.new { "Badge" } %>
```

**Why it's wrong:** ViewComponent requires parentheses around the component instantiation when using block syntax.

### ✅ Correct - Use parentheses with block

```erb
<%= render(UI::Badge::BadgeComponent.new) { "Badge" } %>
```

### ❌ Wrong - Not using symbol for variant

```erb
<%= render(UI::Badge::BadgeComponent.new(variant: "destructive")) { "Error" } %>
```

**Why it's not ideal:** Symbols are more idiomatic in Ruby and slightly more performant.

### ✅ Correct - Use symbol for variant

```erb
<%= render(UI::Badge::BadgeComponent.new(variant: :destructive)) { "Error" } %>
```

### ❌ Wrong - Using badge as button

```erb
<%= render(UI::Badge::BadgeComponent.new(onclick: "handleClick()")) { "Click me" } %>
```

**Why it's wrong:** Badges are not interactive elements. Use a button with badge styling instead.

### ✅ Correct - Wrap in button if interactive

```erb
<button type="button" class="focus:outline-none">
  <%= render(UI::Badge::BadgeComponent.new) { "Click me" } %>
</button>
```

### ❌ Wrong - Too much text in badge

```erb
<%= render(UI::Badge::BadgeComponent.new) { "This is a very long text that doesn't fit" } %>
```

**Why it's wrong:** Badges are meant for short, concise labels.

### ✅ Correct - Keep text short

```erb
<%= render(UI::Badge::BadgeComponent.new) { "New" } %>
```

## Accessibility

**Semantic HTML:**
- Badge uses `<span>` by default, which is appropriate for non-interactive labels
- For interactive badges (links), wrap in `<a>` or `link_to`
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

- ViewComponent guide: `docs/llm/vc.md`
- Phlex implementation: `docs/llm/phlex/badge.md`
- ERB implementation: `docs/llm/erb/badge.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/badge
