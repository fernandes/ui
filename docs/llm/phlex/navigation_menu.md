# Navigation Menu - Phlex

## Component Path

```ruby
UI::NavigationMenu::NavigationMenu
```

## Description

A collection of links for navigating websites. Supports hover/focus activation with intelligent directional animations, keyboard navigation, and multiple content layouts.

Based on [shadcn/ui Navigation Menu](https://ui.shadcn.com/docs/components/navigation-menu) and [Radix UI Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu).

## Basic Usage

```ruby
render UI::NavigationMenu::NavigationMenu.new(viewport: false) do
  render UI::NavigationMenu::List.new do
    render UI::NavigationMenu::Item.new do
      render UI::NavigationMenu::Trigger.new(first: true) { "Getting Started" }
      render UI::NavigationMenu::Content.new(viewport: false) do
        # Content here
      end
    end
  end
end
```

## Sub-Components

### NavigationMenu

Main container for the navigation menu.

**Parameters:**
- `viewport:` Boolean - Enable viewport mode for content display (default: true)
- `delay_duration:` Integer - Delay before opening menu in ms (default: 200)
- `skip_delay_duration:` Integer - Skip delay duration when moving between items (default: 300)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### List

Container for menu items.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Item

Individual menu item container.

**Parameters:**
- `classes:` String - Additional CSS classes (e.g., "hidden md:block" to hide on mobile)
- `**attributes` Hash - Additional HTML attributes

### Trigger

Button that opens the dropdown content.

**Parameters:**
- `first:` Boolean - Deprecated, ignored (every trigger is a Tab stop)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Content

Dropdown content container.

**Parameters:**
- `viewport:` Boolean - Use viewport mode (default: true)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Link

Navigation link inside content.

**Parameters:**
- `href:` String - URL for the link
- `active:` Boolean - Whether link is active (default: false)
- `as_child:` Boolean - Yield attributes for composition with `link_to` (default: false)
- `trigger_style:` Boolean - Style as trigger (for direct links without dropdown) (default: false)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### Viewport (Optional)

Container for animated content display when using viewport mode.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

## Examples

### Complete Example (shadcn demo)

```ruby
render UI::NavigationMenu::NavigationMenu.new(viewport: false) do
  render UI::NavigationMenu::List.new do
    # Home Menu with featured card
    render UI::NavigationMenu::Item.new do
      render UI::NavigationMenu::Trigger.new(first: true) { "Home" }
      render UI::NavigationMenu::Content.new(viewport: false) do
        ul(class: "grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]") do
          li(class: "row-span-3") do
            render UI::NavigationMenu::Link.new(as_child: true) do |link_attrs|
              a(**link_attrs, href: "#", class: "from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6") do
                div(class: "mb-2 text-lg font-medium") { "shadcn/ui" }
                p(class: "text-muted-foreground text-sm") { "Beautifully designed components." }
              end
            end
          end
          li do
            render UI::NavigationMenu::Link.new(as_child: true) do |link_attrs|
              a(**link_attrs, href: "#") do
                div(class: "text-sm font-medium") { "Introduction" }
                p(class: "text-muted-foreground text-sm") { "Re-usable components built with Radix UI." }
              end
            end
          end
        end
      end
    end

    # Components Menu
    render UI::NavigationMenu::Item.new do
      render UI::NavigationMenu::Trigger.new { "Components" }
      render UI::NavigationMenu::Content.new(viewport: false) do
        ul(class: "grid gap-2 md:w-[500px] md:grid-cols-2") do
          li do
            render UI::NavigationMenu::Link.new(as_child: true) do |link_attrs|
              a(**link_attrs, href: "#") do
                div(class: "text-sm font-medium") { "Alert Dialog" }
                p(class: "text-muted-foreground text-sm") { "A modal dialog component." }
              end
            end
          end
          # More items...
        end
      end
    end

    # Direct Link (no dropdown)
    render UI::NavigationMenu::Item.new do
      render UI::NavigationMenu::Link.new(as_child: true, trigger_style: true) do |link_attrs|
        a(**link_attrs, href: "#") { "Docs" }
      end
    end

    # Simple Menu
    render UI::NavigationMenu::Item.new(classes: "hidden md:block") do
      render UI::NavigationMenu::Trigger.new { "Simple" }
      render UI::NavigationMenu::Content.new(viewport: false) do
        ul(class: "grid w-[200px] gap-4") do
          li do
            render UI::NavigationMenu::Link.new(as_child: true) do |link_attrs|
              a(**link_attrs, href: "#") { "Components" }
            end
            render UI::NavigationMenu::Link.new(as_child: true) do |link_attrs|
              a(**link_attrs, href: "#") { "Documentation" }
            end
          end
        end
      end
    end

    # With Icons
    render UI::NavigationMenu::Item.new(classes: "hidden md:block") do
      render UI::NavigationMenu::Trigger.new { "With Icon" }
      render UI::NavigationMenu::Content.new(viewport: false) do
        ul(class: "grid w-[200px] gap-4") do
          li do
            render UI::NavigationMenu::Link.new(as_child: true, classes: "flex-row items-center gap-2") do |link_attrs|
              a(**link_attrs, href: "#") do
                svg_icon # Your icon here
                plain "Backlog"
              end
            end
          end
        end
      end
    end
  end
end
```

### Direct Link (No Dropdown)

Use `trigger_style: true` for links that look like triggers but navigate directly:

```ruby
render UI::NavigationMenu::Item.new do
  render UI::NavigationMenu::Link.new(as_child: true, trigger_style: true) do |link_attrs|
    a(**link_attrs, href: "/docs") { "Documentation" }
  end
end
```

### With Custom Link Classes

Pass `classes:` to customize link appearance:

```ruby
render UI::NavigationMenu::Link.new(as_child: true, classes: "flex-row items-center gap-2") do |link_attrs|
  a(**link_attrs, href: "#") do
    svg_icon
    plain "Item with icon"
  end
end
```

### Hide Items on Mobile

```ruby
render UI::NavigationMenu::Item.new(classes: "hidden md:block") do
  # This item only shows on md screens and up
end
```

## Animation Behavior

The NavigationMenu includes intelligent directional animations:

- **First menu opening**: Fade in only (no slide)
- **Moving right** (e.g., Home → Components): Current menu slides left, new menu slides in from right
- **Moving left** (e.g., Components → Home): Current menu slides right, new menu slides in from left
- **Closing without navigation**: Fade out only (no slide)

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

### ❌ Wrong - Missing `as_child: true` for Link composition

```ruby
render UI::NavigationMenu::Link.new(href: "#") do
  # This renders an <a> tag, can't use link_to
end
```

### ✅ Correct - Use `as_child: true` with `link_to`

```ruby
render UI::NavigationMenu::Link.new(as_child: true) do |link_attrs|
  link_to "#", **link_attrs do
    # Content
  end
end
```

### ❌ Wrong - Custom classes on `link_to` override base styles

```ruby
render UI::NavigationMenu::Link.new(as_child: true) do |link_attrs|
  link_to "#", **link_attrs, class: "flex-row items-center gap-2" do
    # Classes from link_attrs get overridden!
  end
end
```

### ✅ Correct - Pass classes through the Link component

```ruby
render UI::NavigationMenu::Link.new(as_child: true, classes: "flex-row items-center gap-2") do |link_attrs|
  link_to "#", **link_attrs do
    # Classes are properly merged
  end
end
```

## See Also

- Phlex guide: `docs/llm/phlex.md`
- ERB implementation: `docs/llm/erb/navigation_menu.md`
- ViewComponent implementation: `docs/llm/vc/navigation_menu.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/navigation-menu
- Radix UI: https://www.radix-ui.com/primitives/docs/components/navigation-menu
