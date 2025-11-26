# Navigation Menu - ViewComponent

## Component Path

```ruby
UI::NavigationMenu::NavigationMenuComponent
```

## Description

A collection of links for navigating websites. Supports hover/focus activation with intelligent directional animations, keyboard navigation, and multiple content layouts.

Based on [shadcn/ui Navigation Menu](https://ui.shadcn.com/docs/components/navigation-menu) and [Radix UI Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu).

## Basic Usage

```erb
<%= render UI::NavigationMenu::NavigationMenuComponent.new(viewport: false) do %>
  <%= render UI::NavigationMenu::ListComponent.new do %>
    <%= render UI::NavigationMenu::ItemComponent.new do %>
      <%= render UI::NavigationMenu::TriggerComponent.new(first: true) do %>Getting Started<% end %>
      <%= render UI::NavigationMenu::ContentComponent.new(viewport: false) do %>
        <!-- Content here -->
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Sub-Components

### NavigationMenuComponent

Main container component.

**Parameters:**
- `viewport:` Boolean - Enable viewport mode (default: true)
- `delay_duration:` Integer - Delay before opening in ms (default: 200)
- `skip_delay_duration:` Integer - Skip delay when moving between items (default: 300)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### ListComponent

Container for menu items.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### ItemComponent

Individual menu item container.

**Parameters:**
- `classes:` String - Additional CSS classes (e.g., "hidden md:block")
- `**attributes` Hash - Additional HTML attributes

### TriggerComponent

Button that opens the dropdown.

**Parameters:**
- `first:` Boolean - Mark as first trigger (default: false)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### ContentComponent

Dropdown content container.

**Parameters:**
- `viewport:` Boolean - Use viewport mode (default: true)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### LinkComponent

Navigation link inside content.

**Parameters:**
- `href:` String - URL for the link
- `active:` Boolean - Whether link is active (default: false)
- `trigger_style:` Boolean - Style as trigger for direct links (default: false)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

## Examples

### Complete Example (shadcn demo)

```erb
<%= render UI::NavigationMenu::NavigationMenuComponent.new(viewport: false) do %>
  <%= render UI::NavigationMenu::ListComponent.new(classes: "flex-wrap") do %>
    <%# Home Menu %>
    <%= render UI::NavigationMenu::ItemComponent.new do %>
      <%= render UI::NavigationMenu::TriggerComponent.new(first: true) do %>Home<% end %>
      <%= render UI::NavigationMenu::ContentComponent.new(viewport: false) do %>
        <ul class="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li class="row-span-3">
            <%= render UI::NavigationMenu::LinkComponent.new(href: "#", classes: "from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6") do %>
              <div class="mb-2 text-lg font-medium sm:mt-4">shadcn/ui</div>
              <p class="text-muted-foreground text-sm leading-tight">
                Beautifully designed components built with Tailwind CSS.
              </p>
            <% end %>
          </li>
          <li>
            <%= render UI::NavigationMenu::LinkComponent.new(href: "#") do %>
              <div class="text-sm leading-none font-medium">Introduction</div>
              <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
                Re-usable components built using Radix UI and Tailwind CSS.
              </p>
            <% end %>
          </li>
          <li>
            <%= render UI::NavigationMenu::LinkComponent.new(href: "#") do %>
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
    <%= render UI::NavigationMenu::ItemComponent.new do %>
      <%= render UI::NavigationMenu::TriggerComponent.new do %>Components<% end %>
      <%= render UI::NavigationMenu::ContentComponent.new(viewport: false) do %>
        <ul class="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          <li>
            <%= render UI::NavigationMenu::LinkComponent.new(href: "#") do %>
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
    <%= render UI::NavigationMenu::ItemComponent.new do %>
      <%= render UI::NavigationMenu::LinkComponent.new(href: "#", trigger_style: true) do %>Docs<% end %>
    <% end %>

    <%# Simple Menu (hidden on mobile) %>
    <%= render UI::NavigationMenu::ItemComponent.new(classes: "hidden md:block") do %>
      <%= render UI::NavigationMenu::TriggerComponent.new do %>Simple<% end %>
      <%= render UI::NavigationMenu::ContentComponent.new(viewport: false) do %>
        <ul class="grid w-[200px] gap-4">
          <li>
            <%= render UI::NavigationMenu::LinkComponent.new(href: "#") do %>Components<% end %>
            <%= render UI::NavigationMenu::LinkComponent.new(href: "#") do %>Documentation<% end %>
            <%= render UI::NavigationMenu::LinkComponent.new(href: "#") do %>Blocks<% end %>
          </li>
        </ul>
      <% end %>
    <% end %>

    <%# With Icons %>
    <%= render UI::NavigationMenu::ItemComponent.new(classes: "hidden md:block") do %>
      <%= render UI::NavigationMenu::TriggerComponent.new do %>With Icon<% end %>
      <%= render UI::NavigationMenu::ContentComponent.new(viewport: false) do %>
        <ul class="grid w-[200px] gap-4">
          <li>
            <%= render UI::NavigationMenu::LinkComponent.new(href: "#", classes: "flex-row items-center gap-2") do %>
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
<%= render UI::NavigationMenu::ItemComponent.new do %>
  <%= render UI::NavigationMenu::LinkComponent.new(href: "/docs", trigger_style: true) do %>
    Documentation
  <% end %>
<% end %>
```

### With Custom Classes

```erb
<%= render UI::NavigationMenu::LinkComponent.new(href: "#", classes: "flex-row items-center gap-2") do %>
  <svg><!-- icon --></svg>
  Item with icon
<% end %>
```

### Hide Items on Mobile

```erb
<%= render UI::NavigationMenu::ItemComponent.new(classes: "hidden md:block") do %>
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
| ArrowRight | Focus next trigger |
| ArrowLeft | Focus previous trigger |
| ArrowDown | Open menu / Focus first link |
| Enter/Space | Toggle menu |
| Escape | Close menu |
| Home | Focus first trigger |
| End | Focus last trigger |
| Tab | Navigate through content links |

## Common Mistakes

### ❌ Wrong - Using wrong component class name

```erb
<%= render UI::NavigationMenu::NavigationMenu.new %>  <%# This is Phlex! %>
```

### ✅ Correct - Use Component suffix

```erb
<%= render UI::NavigationMenu::NavigationMenuComponent.new %>
```

### ❌ Wrong - Missing `first: true` on first trigger

```erb
<%= render UI::NavigationMenu::TriggerComponent.new do %>First Item<% end %>
```

### ✅ Correct - Mark first trigger for proper tabindex

```erb
<%= render UI::NavigationMenu::TriggerComponent.new(first: true) do %>First Item<% end %>
```

### ❌ Wrong - Forgetting `viewport: false` on both menu and content

```erb
<%= render UI::NavigationMenu::NavigationMenuComponent.new do %>
  <%= render UI::NavigationMenu::ContentComponent.new do %>
    <!-- Content won't position correctly -->
  <% end %>
<% end %>
```

### ✅ Correct - Set `viewport: false` consistently

```erb
<%= render UI::NavigationMenu::NavigationMenuComponent.new(viewport: false) do %>
  <%= render UI::NavigationMenu::ContentComponent.new(viewport: false) do %>
    <!-- Content positions correctly under trigger -->
  <% end %>
<% end %>
```

## ViewComponent vs Phlex Class Names

| ViewComponent | Phlex |
|---------------|-------|
| `NavigationMenuComponent` | `NavigationMenu` |
| `ListComponent` | `List` |
| `ItemComponent` | `Item` |
| `TriggerComponent` | `Trigger` |
| `ContentComponent` | `Content` |
| `LinkComponent` | `Link` |

## See Also

- ViewComponent guide: `docs/llm/vc.md`
- Phlex implementation: `docs/llm/phlex/navigation_menu.md`
- ERB implementation: `docs/llm/erb/navigation_menu.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/navigation-menu
- Radix UI: https://www.radix-ui.com/primitives/docs/components/navigation-menu
