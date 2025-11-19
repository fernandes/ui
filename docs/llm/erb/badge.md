# Badge - ERB

## Component Path

```erb
<%= render "ui/badge/badge" %>
```

## Description

Displays a badge or a component that looks like a badge. Badges are small labeled indicators used for statuses, categories, tags, or counts.

Based on [shadcn/ui Badge](https://ui.shadcn.com/docs/components/badge).

## Basic Usage

```erb
<%= render "ui/badge/badge" do %>
  Badge
<% end %>
```

## Parameters

### ui/badge/badge

**Parameters:**
- `variant:` Symbol or String - Visual style variant (default: `:default`)
  - `:default` - Primary background with foreground text
  - `:secondary` - Secondary background styling
  - `:destructive` - Danger/error state
  - `:outline` - Border-based style with transparent background
- `classes:` String - Additional Tailwind CSS classes to merge

**Example:**
```erb
<%= render "ui/badge/badge", variant: :destructive do %>
  Error
<% end %>
```

## Examples

### Default Badge

```erb
<%= render "ui/badge/badge" do %>
  Badge
<% end %>
```

### Variant Badges

```erb
<%# Secondary variant %>
<%= render "ui/badge/badge", variant: :secondary do %>
  Secondary
<% end %>

<%# Destructive variant %>
<%= render "ui/badge/badge", variant: :destructive do %>
  Destructive
<% end %>

<%# Outline variant %>
<%= render "ui/badge/badge", variant: :outline do %>
  Outline
<% end %>
```

### Badge as Link

```erb
<%= link_to "/notifications", class: "no-underline" do %>
  <%= render "ui/badge/badge" do %>
    5
  <% end %>
<% end %>
```

### Badge with Icon

```erb
<%= render "ui/badge/badge" do %>
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
  <%= render "ui/badge/badge", classes: "h-5 min-w-5 font-mono tabular-nums" do %>
    12
  <% end %>
</div>
```

### Pill Badge

```erb
<%= render "ui/badge/badge", classes: "rounded-full px-1" do %>
  New
<% end %>
```

### Status Indicators

```erb
<div class="flex gap-2">
  <%= render "ui/badge/badge", variant: :default do %>
    Active
  <% end %>
  <%= render "ui/badge/badge", variant: :secondary do %>
    Pending
  <% end %>
  <%= render "ui/badge/badge", variant: :outline do %>
    Draft
  <% end %>
  <%= render "ui/badge/badge", variant: :destructive do %>
    Archived
  <% end %>
</div>
```

### Category Tags

```erb
<div class="flex flex-wrap gap-2">
  <% ["React", "TypeScript", "Tailwind", "Next.js"].each do |tag| %>
    <%= render "ui/badge/badge", variant: :outline do %>
      <%= tag %>
    <% end %>
  <% end %>
</div>
```

### User Role Badge

```erb
<div class="flex items-center gap-2">
  John Doe
  <%= render "ui/badge/badge", variant: :secondary, classes: "text-[10px]" do %>
    Admin
  <% end %>
</div>
```

### Removable Badge

```erb
<%= render "ui/badge/badge", variant: :secondary, classes: "gap-1" do %>
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
    <%= render "ui/badge/badge", variant: :default do %>
      In Progress
    <% end %>
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
  <%= render "ui/badge/badge", classes: "absolute -top-1 -right-1 h-5 min-w-5 p-0 text-[10px]" do %>
    3
  <% end %>
</div>
```

### Status with Color

```erb
<div class="flex items-center gap-2">
  <div class="size-2 rounded-full bg-green-500"></div>
  <%= render "ui/badge/badge", variant: :outline do %>
    Online
  <% end %>
</div>
```

### Badge Group

```erb
<div class="flex flex-wrap items-center gap-2">
  <span class="text-sm font-medium">Tags:</span>
  <%= render "ui/badge/badge", variant: :secondary do %>
    Design
  <% end %>
  <%= render "ui/badge/badge", variant: :secondary do %>
    Development
  <% end %>
  <%= render "ui/badge/badge", variant: :secondary do %>
    Marketing
  <% end %>
</div>
```

### Dynamic Badges from Array

```erb
<div class="flex flex-wrap gap-2">
  <% @tags.each do |tag| %>
    <%= render "ui/badge/badge", variant: :outline do %>
      <%= tag.name %>
    <% end %>
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

### ❌ Wrong - Not using symbol for variant

```erb
<%= render "ui/badge/badge", variant: "destructive" do %>
  Error
<% end %>
```

**Why it's not ideal:** Symbols are more idiomatic in Ruby and slightly more performant.

### ✅ Correct - Use symbol for variant

```erb
<%= render "ui/badge/badge", variant: :destructive do %>
  Error
<% end %>
```

### ❌ Wrong - Using badge as button

```erb
<%= render "ui/badge/badge", onclick: "handleClick()" do %>
  Click me
<% end %>
```

**Why it's wrong:** Badges are not interactive elements. Use a button with badge styling instead.

### ✅ Correct - Wrap in button if interactive

```erb
<button type="button" class="focus:outline-none">
  <%= render "ui/badge/badge" do %>
    Click me
  <% end %>
</button>
```

### ❌ Wrong - Too much text in badge

```erb
<%= render "ui/badge/badge" do %>
  This is a very long text that doesn't fit
<% end %>
```

**Why it's wrong:** Badges are meant for short, concise labels.

### ✅ Correct - Keep text short

```erb
<%= render "ui/badge/badge" do %>
  New
<% end %>
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

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/badge.md`
- ViewComponent implementation: `docs/llm/vc/badge.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/badge
