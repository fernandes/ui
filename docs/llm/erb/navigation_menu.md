# Navigation Menu - ERB

## Component Path

```erb
<%= render "ui/navigation_menu/navigation_menu" %>
```

## Description

A collection of links for navigating websites. Supports hover/focus activation with intelligent directional animations, keyboard navigation, and multiple content layouts.

Based on [shadcn/ui Navigation Menu](https://ui.shadcn.com/docs/components/navigation-menu) and [Radix UI Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu).

## Basic Usage

```erb
<%= render "ui/navigation_menu/navigation_menu", viewport: false do %>
  <%= render "ui/navigation_menu/list" do %>
    <%= render "ui/navigation_menu/item" do %>
      <%= render "ui/navigation_menu/trigger", first: true do %>Getting Started<% end %>
      <%= render "ui/navigation_menu/content", viewport: false do %>
        <!-- Content here -->
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Sub-Components

### navigation_menu

Main container partial.

**Parameters:**
- `viewport:` Boolean - Enable viewport mode (default: true)
- `delay_duration:` Integer - Delay before opening in ms (default: 200)
- `skip_delay_duration:` Integer - Skip delay when moving between items (default: 300)
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### list

Container for menu items.

**Parameters:**
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### item

Individual menu item container.

**Parameters:**
- `classes:` String - Additional CSS classes (e.g., "hidden md:block")
- `attributes:` Hash - Additional HTML attributes

### trigger

Button that opens the dropdown.

**Parameters:**
- `first:` Boolean - Deprecated, ignored (every trigger is a Tab stop)
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### content

Dropdown content container.

**Parameters:**
- `viewport:` Boolean - Use viewport mode (default: true)
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### link

Navigation link inside content.

**Parameters:**
- `href:` String - URL for the link
- `active:` Boolean - Whether link is active (default: false)
- `trigger_style:` Boolean - Style as trigger for direct links (default: false)
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

## Examples

### Complete Example (shadcn demo)

```erb
<%= render "ui/navigation_menu/navigation_menu", viewport: false do %>
  <%= render "ui/navigation_menu/list", classes: "flex-wrap" do %>
    <%# Home Menu %>
    <%= render "ui/navigation_menu/item" do %>
      <%= render "ui/navigation_menu/trigger", first: true do %>Home<% end %>
      <%= render "ui/navigation_menu/content", viewport: false do %>
        <ul class="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li class="row-span-3">
            <%= render "ui/navigation_menu/link", href: "#", classes: "from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6" do %>
              <div class="mb-2 text-lg font-medium sm:mt-4">shadcn/ui</div>
              <p class="text-muted-foreground text-sm leading-tight">
                Beautifully designed components built with Tailwind CSS.
              </p>
            <% end %>
          </li>
          <li>
            <%= render "ui/navigation_menu/link", href: "#" do %>
              <div class="text-sm leading-none font-medium">Introduction</div>
              <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
                Re-usable components built using Radix UI and Tailwind CSS.
              </p>
            <% end %>
          </li>
          <li>
            <%= render "ui/navigation_menu/link", href: "#" do %>
              <div class="text-sm leading-none font-medium">Installation</div>
              <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
                How to install dependencies and structure your app.
              </p>
            <% end %>
          </li>
        </ul>
      <% end %>
    <% end %>

    <%# Components Menu %>
    <%= render "ui/navigation_menu/item" do %>
      <%= render "ui/navigation_menu/trigger" do %>Components<% end %>
      <%= render "ui/navigation_menu/content", viewport: false do %>
        <ul class="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          <li>
            <%= render "ui/navigation_menu/link", href: "#" do %>
              <div class="text-sm leading-none font-medium">Alert Dialog</div>
              <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
                A modal dialog that interrupts the user.
              </p>
            <% end %>
          </li>
          <!-- More items... -->
        </ul>
      <% end %>
    <% end %>

    <%# Direct Link (no dropdown) %>
    <%= render "ui/navigation_menu/item" do %>
      <%= render "ui/navigation_menu/link", href: "#", trigger_style: true do %>Docs<% end %>
    <% end %>

    <%# Simple Menu (hidden on mobile) %>
    <%= render "ui/navigation_menu/item", classes: "hidden md:block" do %>
      <%= render "ui/navigation_menu/trigger" do %>Simple<% end %>
      <%= render "ui/navigation_menu/content", viewport: false do %>
        <ul class="grid w-[200px] gap-4">
          <li>
            <%= render "ui/navigation_menu/link", href: "#" do %>Components<% end %>
            <%= render "ui/navigation_menu/link", href: "#" do %>Documentation<% end %>
            <%= render "ui/navigation_menu/link", href: "#" do %>Blocks<% end %>
          </li>
        </ul>
      <% end %>
    <% end %>

    <%# With Icons %>
    <%= render "ui/navigation_menu/item", classes: "hidden md:block" do %>
      <%= render "ui/navigation_menu/trigger" do %>With Icon<% end %>
      <%= render "ui/navigation_menu/content", viewport: false do %>
        <ul class="grid w-[200px] gap-4">
          <li>
            <%= render "ui/navigation_menu/link", href: "#", classes: "flex-row items-center gap-2" do %>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted-foreground"><circle cx="12" cy="12" r="10"/></svg>
              Backlog
            <% end %>
          </li>
        </ul>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Direct Link (No Dropdown)

Use `trigger_style: true` for links styled like triggers:

```erb
<%= render "ui/navigation_menu/item" do %>
  <%= render "ui/navigation_menu/link", href: "/docs", trigger_style: true do %>
    Documentation
  <% end %>
<% end %>
```

### With Custom Classes

```erb
<%= render "ui/navigation_menu/link", href: "#", classes: "flex-row items-center gap-2" do %>
  <svg><!-- icon --></svg>
  Item with icon
<% end %>
```

### Hide Items on Mobile

```erb
<%= render "ui/navigation_menu/item", classes: "hidden md:block" do %>
  <!-- Only shows on md screens and up -->
<% end %>
```

## Animation Behavior

The NavigationMenu includes intelligent directional animations:

- **First menu opening**: Fade in only (no slide)
- **Moving right**: Current menu slides left, new slides from right
- **Moving left**: Current menu slides right, new slides from left
- **Closing**: Fade out only (no slide)

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab / Shift+Tab | Every trigger and top-level link is a Tab stop; Tab from an open trigger enters its content, Tab from the last link moves on and closes it |
| ArrowRight / ArrowLeft | Focus next / previous trigger or top-level link (wraps) |
| ArrowDown | Open menu / focus first link; inside content, next link |
| ArrowUp | Inside content, previous link |
| Enter/Space | Toggle menu (native button click) |
| Escape | Close menu and return focus to its trigger |
| Home / End | Focus first / last top-level item (first / last link inside content) |

## Accessibility

- It's navigation, not a composite widget: there is no roving tabindex. `first:` is still
  accepted on triggers but no longer needed (ignored).
- Each trigger gets `aria-controls` → its content and `aria-expanded`; the content is labelled by
  its trigger. Ids are generated per instance by the controller.
- The `<nav>` is named `aria-label="Main"` unless you pass `aria-label` / `aria-labelledby`
  (give each navigation menu on a page its own name).
- Viewport mode (default) moves the real content node into the viewport while it's open and back
  into its item when closed, so links and ids are never duplicated. Closed panels are hidden in
  both modes, even when no exit animation runs.
- The menu closes on Escape, on an outside click, when focus leaves the open item, and when a link
  inside a panel is followed.

## Common Mistakes

### ❌ Wrong - Forgetting `viewport: false` on both menu and content

```erb
<%= render "ui/navigation_menu/navigation_menu" do %>
  <%= render "ui/navigation_menu/content" do %>
    <!-- Content won't position correctly -->
  <% end %>
<% end %>
```

### ✅ Correct - Set `viewport: false` consistently

```erb
<%= render "ui/navigation_menu/navigation_menu", viewport: false do %>
  <%= render "ui/navigation_menu/content", viewport: false do %>
    <!-- Content positions correctly under trigger -->
  <% end %>
<% end %>
```

### ❌ Wrong - Using `<% %>` instead of `<%= %>`

```erb
<% render "ui/navigation_menu/navigation_menu" do %>
  <!-- Nothing renders! -->
<% end %>
```

### ✅ Correct - Use `<%= %>` to output

```erb
<%= render "ui/navigation_menu/navigation_menu" do %>
  <!-- Renders correctly -->
<% end %>
```

## See Also

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/navigation_menu.md`
- ViewComponent implementation: `docs/llm/vc/navigation_menu.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/navigation-menu
- Radix UI: https://www.radix-ui.com/primitives/docs/components/navigation-menu
