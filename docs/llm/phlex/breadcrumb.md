# Breadcrumb - Phlex

## Component Path

```ruby
UI::Breadcrumb::{SubComponent}
```

## Description

A navigation breadcrumb component that displays the path to the current resource using a hierarchy of links. Breadcrumbs provide users with context about their location within an application and offer quick navigation to parent pages.

Based on [shadcn/ui Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb).

## Basic Usage

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/") { "Home" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/components") { "Components" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Page.new { "Breadcrumb" }
    end
  end
end
```

## Sub-Components

### UI::Breadcrumb::Breadcrumb

Main container (`<nav>`) that wraps the breadcrumb navigation. Provides semantic navigation structure with `aria-label="breadcrumb"`.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```ruby
render UI::Breadcrumb::Breadcrumb.new do
  # Breadcrumb content
end
```

### UI::Breadcrumb::List

Ordered list container (`<ol>`) that holds breadcrumb items. Provides flex layout with proper spacing and text styling.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5`

**Example:**
```ruby
render UI::Breadcrumb::List.new do
  # Breadcrumb items
end
```

### UI::Breadcrumb::Item

Individual breadcrumb item (`<li>`) that contains a link, page indicator, or ellipsis.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `inline-flex items-center gap-1.5`

**Example:**
```ruby
render UI::Breadcrumb::Item.new do
  render UI::Breadcrumb::Link.new(href: "/") { "Home" }
end
```

### UI::Breadcrumb::Link

Clickable link (`<a>`) for navigating to parent pages. Includes hover state with color transition.

**Parameters:**
- `href:` String - Link destination URL (default: `"#"`)
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `transition-colors hover:text-foreground`

**Example:**
```ruby
render UI::Breadcrumb::Link.new(href: "/components") { "Components" }
```

### UI::Breadcrumb::Page

Current page indicator (`<span>`) that represents the active page. Non-clickable with appropriate ARIA attributes.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `font-normal text-foreground`

**ARIA Attributes:**
- `role="link"` - Identifies as a link for screen readers
- `aria-disabled="true"` - Indicates it's not clickable
- `aria-current="page"` - Marks as the current page

**Example:**
```ruby
render UI::Breadcrumb::Page.new { "Current Page" }
```

### UI::Breadcrumb::Separator

Visual divider (`<li>`) between breadcrumb items. Defaults to a chevron-right icon but can accept custom content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `[&>svg]:size-3.5`

**ARIA Attributes:**
- `role="presentation"` - Indicates decorative element
- `aria-hidden="true"` - Hides from screen readers

**Default Icon:** Chevron right (>)

**Example:**
```ruby
# Default separator (chevron)
render UI::Breadcrumb::Separator.new

# Custom separator
render UI::Breadcrumb::Separator.new do
  span { "/" }
end
```

### UI::Breadcrumb::Ellipsis

Collapsed items indicator (`<span>`) showing that some breadcrumb items are hidden. Typically used with DropdownMenu for responsive breadcrumbs.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `flex h-9 w-9 items-center justify-center`

**ARIA Attributes:**
- `role="presentation"` - Indicates decorative element
- `aria-hidden="true"` - Hides from screen readers (the dropdown trigger provides proper semantics)

**Default Icon:** Three dots (•••) with "More" screen reader text

**Example:**
```ruby
# Default ellipsis
render UI::Breadcrumb::Ellipsis.new

# Custom ellipsis
render UI::Breadcrumb::Ellipsis.new do
  span { "..." }
end
```

## Examples

### Default Breadcrumb

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/") { "Home" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/components") { "Components" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Page.new { "Breadcrumb" }
    end
  end
end
```

### With Custom Separator

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/") { "Home" }
    end
    render UI::Breadcrumb::Separator.new do
      span(class: "text-muted-foreground") { "/" }
    end
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/docs") { "Docs" }
    end
    render UI::Breadcrumb::Separator.new do
      span(class: "text-muted-foreground") { "/" }
    end
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Page.new { "Components" }
    end
  end
end
```

### With Custom Styling

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/", classes: "text-blue-600") { "Home" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/products", classes: "text-blue-600") { "Products" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Page.new(classes: "font-semibold") { "Laptop" }
    end
  end
end
```

### Responsive Breadcrumb with Dropdown (Collapsed Items)

This is a critical pattern for mobile-responsive breadcrumbs. Use `BreadcrumbEllipsis` inside a `DropdownMenu` to hide middle items on smaller screens.

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    # First item (always visible)
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/") { "Home" }
    end
    render UI::Breadcrumb::Separator.new

    # Collapsed items in dropdown
    render UI::Breadcrumb::Item.new do
      render UI::DropdownMenu::DropdownMenu.new do
        render UI::DropdownMenu::Trigger.new(classes: "flex items-center gap-1") do
          render UI::Breadcrumb::Ellipsis.new
          span(class: "sr-only") { "Toggle menu" }
        end
        render UI::DropdownMenu::Content.new(align: "start") do
          render UI::DropdownMenu::Item.new do
            a(href: "/docs") { "Documentation" }
          end
          render UI::DropdownMenu::Item.new do
            a(href: "/docs/themes") { "Themes" }
          end
          render UI::DropdownMenu::Item.new do
            a(href: "/docs/github") { "GitHub" }
          end
        end
      end
    end
    render UI::Breadcrumb::Separator.new

    # Last few items (always visible)
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/components") { "Components" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Page.new { "Breadcrumb" }
    end
  end
end
```

## Common Patterns

### Simple Navigation Path

For basic page hierarchies:

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/") { "Home" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Page.new { "Settings" }
    end
  end
end
```

### Multi-Level Navigation

For deep page hierarchies:

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/") { "Home" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/products") { "Products" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/products/electronics") { "Electronics" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/products/electronics/laptops") { "Laptops" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Page.new { "MacBook Pro" }
    end
  end
end
```

### Dynamic Breadcrumbs from Array

Programmatic generation from a breadcrumb data structure:

```ruby
breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Electronics", href: "/products/electronics" },
  { label: "Laptops", href: nil } # nil href indicates current page
]

render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    breadcrumbs.each_with_index do |crumb, index|
      render UI::Breadcrumb::Item.new do
        if crumb[:href]
          render UI::Breadcrumb::Link.new(href: crumb[:href]) { crumb[:label] }
        else
          render UI::Breadcrumb::Page.new { crumb[:label] }
        end
      end

      # Add separator unless it's the last item
      render UI::Breadcrumb::Separator.new unless index == breadcrumbs.length - 1
    end
  end
end
```

### Custom Icon Separators

Using different separator icons:

```ruby
# Arrow separator
render UI::Breadcrumb::Separator.new do
  span(class: "text-muted-foreground") { "→" }
end

# Slash separator
render UI::Breadcrumb::Separator.new do
  span(class: "text-muted-foreground") { "/" }
end

# Dot separator
render UI::Breadcrumb::Separator.new do
  span(class: "text-muted-foreground") { "•" }
end
```

## Accessibility

**Keyboard Navigation:**
- Links are fully keyboard accessible via `Tab` key
- `Enter` activates the focused link
- Dropdown menu (when used with ellipsis) supports full keyboard navigation

**ARIA Attributes:**
- `aria-label="breadcrumb"` - On the `<nav>` element, identifies the navigation type
- `aria-current="page"` - On the Page component, marks the current page
- `aria-disabled="true"` - On the Page component, indicates it's not interactive
- `role="link"` - On the Page component, maintains link semantics
- `role="presentation"` and `aria-hidden="true"` - On separators and ellipsis, hides decorative elements

**Screen Reader Behavior:**
- Breadcrumb is announced as "breadcrumb navigation"
- Current page is announced with "current page"
- Separators are hidden from screen readers (visual only)
- Each link is announced with its text

## Common Mistakes

### ❌ Wrong - Using Module Instead of Class

```ruby
# This won't work - UI::Breadcrumb is a module
render UI::Breadcrumb.new do
  # ...
end
```

**Why it's wrong:** `UI::Breadcrumb` is a module namespace, not a component class.

### ✅ Correct - Use Full Path

```ruby
# Correct - UI::Breadcrumb::Breadcrumb is the component class
render UI::Breadcrumb::Breadcrumb.new do
  # ...
end
```

### ❌ Wrong - Forgetting List Container

```ruby
# Missing BreadcrumbList wrapper
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::Item.new do
    render UI::Breadcrumb::Link.new(href: "/") { "Home" }
  end
end
```

**Why it's wrong:** The List component provides essential layout and styling. Without it, items won't display correctly.

### ✅ Correct - Always Include List

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: "/") { "Home" }
    end
  end
end
```

### ❌ Wrong - Using Link for Current Page

```ruby
# Don't use Link for the current page
render UI::Breadcrumb::Item.new do
  render UI::Breadcrumb::Link.new(href: "#") { "Current Page" }
end
```

**Why it's wrong:** The current page should not be clickable and needs proper ARIA attributes.

### ✅ Correct - Use Page for Current Page

```ruby
render UI::Breadcrumb::Item.new do
  render UI::Breadcrumb::Page.new { "Current Page" }
end
```

### ❌ Wrong - Forgetting Separators

```ruby
render UI::Breadcrumb::List.new do
  render UI::Breadcrumb::Item.new do
    render UI::Breadcrumb::Link.new(href: "/") { "Home" }
  end
  # Missing separator!
  render UI::Breadcrumb::Item.new do
    render UI::Breadcrumb::Page.new { "Page" }
  end
end
```

**Why it's wrong:** Visual hierarchy is lost without separators between items.

### ✅ Correct - Include Separators Between Items

```ruby
render UI::Breadcrumb::List.new do
  render UI::Breadcrumb::Item.new do
    render UI::Breadcrumb::Link.new(href: "/") { "Home" }
  end
  render UI::Breadcrumb::Separator.new
  render UI::Breadcrumb::Item.new do
    render UI::Breadcrumb::Page.new { "Page" }
  end
end
```

### ❌ Wrong - Ellipsis Without DropdownMenu

```ruby
# Just rendering ellipsis alone doesn't provide interaction
render UI::Breadcrumb::Item.new do
  render UI::Breadcrumb::Ellipsis.new
end
```

**Why it's wrong:** Ellipsis is meant to indicate hidden items. Without a dropdown, there's no way to access them.

### ✅ Correct - Ellipsis With DropdownMenu

```ruby
render UI::Breadcrumb::Item.new do
  render UI::DropdownMenu::DropdownMenu.new do
    render UI::DropdownMenu::Trigger.new do
      render UI::Breadcrumb::Ellipsis.new
    end
    render UI::DropdownMenu::Content.new do
      # Hidden breadcrumb items as menu items
    end
  end
end
```

## Integration with Other Components

### With DropdownMenu for Responsive Breadcrumbs

The most common integration pattern - hiding middle breadcrumb items in a dropdown menu:

```ruby
render UI::Breadcrumb::Item.new do
  render UI::DropdownMenu::DropdownMenu.new do
    render UI::DropdownMenu::Trigger.new(classes: "flex items-center gap-1") do
      render UI::Breadcrumb::Ellipsis.new
      span(class: "sr-only") { "Show more" }
    end
    render UI::DropdownMenu::Content.new(align: "start") do
      render UI::DropdownMenu::Item.new do
        a(href: "/docs") { "Documentation" }
      end
      render UI::DropdownMenu::Item.new do
        a(href: "/themes") { "Themes" }
      end
    end
  end
end
```

### With Rails Route Helpers

```ruby
render UI::Breadcrumb::Breadcrumb.new do
  render UI::Breadcrumb::List.new do
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: root_path) { "Home" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Link.new(href: products_path) { "Products" }
    end
    render UI::Breadcrumb::Separator.new
    render UI::Breadcrumb::Item.new do
      render UI::Breadcrumb::Page.new { @product.name }
    end
  end
end
```

### With Turbo Frames

```ruby
render UI::Breadcrumb::Link.new(
  href: products_path,
  attributes: { "data-turbo-frame": "content" }
) { "Products" }
```

## See Also

- Phlex guide: `docs/llm/phlex.md`
- ERB implementation: `docs/llm/erb/breadcrumb.md`
- ViewComponent implementation: `docs/llm/vc/breadcrumb.md`
- DropdownMenu component: `docs/llm/phlex/dropdown_menu.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/breadcrumb
