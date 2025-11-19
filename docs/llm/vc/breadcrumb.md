# Breadcrumb - ViewComponent

## Component Path

```ruby
UI::Breadcrumb::{SubComponent}Component
```

## Description

A navigation breadcrumb component that displays the path to the current resource using a hierarchy of links. Breadcrumbs provide users with context about their location within an application and offer quick navigation to parent pages.

Based on [shadcn/ui Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb).

## Basic Usage

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") do %>
        Home
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/components") do %>
        Components
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbPageComponent.new do %>
        Breadcrumb
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Sub-Components

### UI::Breadcrumb::BreadcrumbComponent

Main container (`<nav>`) that wraps the breadcrumb navigation. Provides semantic navigation structure with `aria-label="breadcrumb"`.

**Class:** `UI::Breadcrumb::BreadcrumbComponent`
**File:** `app/components/ui/breadcrumb/breadcrumb_component.rb`

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  # Breadcrumb content
<% end %>
```

### UI::Breadcrumb::BreadcrumbListComponent

Ordered list container (`<ol>`) that holds breadcrumb items. Provides flex layout with proper spacing and text styling.

**Class:** `UI::Breadcrumb::BreadcrumbListComponent`
**File:** `app/components/ui/breadcrumb/breadcrumb_list_component.rb`

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5`

**Example:**
```ruby
<%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
  # Breadcrumb items
<% end %>
```

### UI::Breadcrumb::BreadcrumbItemComponent

Individual breadcrumb item (`<li>`) that contains a link, page indicator, or ellipsis.

**Class:** `UI::Breadcrumb::BreadcrumbItemComponent`
**File:** `app/components/ui/breadcrumb/breadcrumb_item_component.rb`

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `inline-flex items-center gap-1.5`

**Example:**
```ruby
<%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") { "Home" } %>
<% end %>
```

### UI::Breadcrumb::BreadcrumbLinkComponent

Clickable link (`<a>`) for navigating to parent pages. Includes hover state with color transition.

**Class:** `UI::Breadcrumb::BreadcrumbLinkComponent`
**File:** `app/components/ui/breadcrumb/breadcrumb_link_component.rb`

**Parameters:**
- `href:` String - Link destination URL (default: `"#"`)
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `**attributes` Hash - Any additional HTML attributes

**Base Classes:**
- `transition-colors hover:text-foreground`

**Example:**
```ruby
<%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/components") { "Components" } %>
```

### UI::Breadcrumb::BreadcrumbPageComponent

Current page indicator (`<span>`) that represents the active page. Non-clickable with appropriate ARIA attributes.

**Class:** `UI::Breadcrumb::BreadcrumbPageComponent`
**File:** `app/components/ui/breadcrumb/breadcrumb_page_component.rb`

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
<%= render UI::Breadcrumb::BreadcrumbPageComponent.new { "Current Page" } %>
```

### UI::Breadcrumb::BreadcrumbSeparatorComponent

Visual divider (`<li>`) between breadcrumb items. Defaults to a chevron-right icon but can accept custom content via block.

**Class:** `UI::Breadcrumb::BreadcrumbSeparatorComponent`
**File:** `app/components/ui/breadcrumb/breadcrumb_separator_component.rb`

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
<%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>

# Custom separator
<%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new do %>
  <span>/</span>
<% end %>
```

### UI::Breadcrumb::BreadcrumbEllipsisComponent

Collapsed items indicator (`<span>`) showing that some breadcrumb items are hidden. Typically used with DropdownMenu for responsive breadcrumbs.

**Class:** `UI::Breadcrumb::BreadcrumbEllipsisComponent`
**File:** `app/components/ui/breadcrumb/breadcrumb_ellipsis_component.rb`

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
<%= render UI::Breadcrumb::BreadcrumbEllipsisComponent.new %>

# Custom ellipsis
<%= render UI::Breadcrumb::BreadcrumbEllipsisComponent.new do %>
  <span>...</span>
<% end %>
```

## Examples

### Default Breadcrumb

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") do %>
        Home
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/components") do %>
        Components
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbPageComponent.new do %>
        Breadcrumb
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Custom Separator

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") do %>
        Home
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new do %>
      <span class="text-muted-foreground">/</span>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/docs") do %>
        Docs
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new do %>
      <span class="text-muted-foreground">/</span>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbPageComponent.new do %>
        Components
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Custom Styling

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/", classes: "text-blue-600") do %>
        Home
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/products", classes: "text-blue-600") do %>
        Products
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbPageComponent.new(classes: "font-semibold") do %>
        Laptop
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Responsive Breadcrumb with Dropdown (Collapsed Items)

This is a critical pattern for mobile-responsive breadcrumbs. Use `BreadcrumbEllipsisComponent` inside a `DropdownMenu` to hide middle items on smaller screens.

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%# First item (always visible) %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") do %>
        Home
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>

    <%# Collapsed items in dropdown %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::DropdownMenu::DropdownMenuComponent.new do %>
        <%= render UI::DropdownMenu::TriggerComponent.new(classes: "flex items-center gap-1") do %>
          <%= render UI::Breadcrumb::BreadcrumbEllipsisComponent.new %>
          <span class="sr-only">Toggle menu</span>
        <% end %>
        <%= render UI::DropdownMenu::ContentComponent.new(align: "start") do %>
          <%= render UI::DropdownMenu::ItemComponent.new do %>
            <a href="/docs">Documentation</a>
          <% end %>
          <%= render UI::DropdownMenu::ItemComponent.new do %>
            <a href="/docs/themes">Themes</a>
          <% end %>
          <%= render UI::DropdownMenu::ItemComponent.new do %>
            <a href="/docs/github">GitHub</a>
          <% end %>
        <% end %>
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>

    <%# Last few items (always visible) %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/components") do %>
        Components
      <% end %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbPageComponent.new do %>
        Breadcrumb
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Common Patterns

### Simple Navigation Path

For basic page hierarchies:

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") { "Home" } %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbPageComponent.new { "Settings" } %>
    <% end %>
  <% end %>
<% end %>
```

### Multi-Level Navigation

For deep page hierarchies:

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") { "Home" } %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/products") { "Products" } %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/products/electronics") { "Electronics" } %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/products/electronics/laptops") { "Laptops" } %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbPageComponent.new { "MacBook Pro" } %>
    <% end %>
  <% end %>
<% end %>
```

### Dynamic Breadcrumbs from Array

Programmatic generation from a breadcrumb data structure:

```ruby
<%
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "Laptops", href: nil } # nil href indicates current page
  ]
%>

<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <% breadcrumbs.each_with_index do |crumb, index| %>
      <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
        <% if crumb[:href] %>
          <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: crumb[:href]) { crumb[:label] } %>
        <% else %>
          <%= render UI::Breadcrumb::BreadcrumbPageComponent.new { crumb[:label] } %>
        <% end %>
      <% end %>

      <%# Add separator unless it's the last item %>
      <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new unless index == breadcrumbs.length - 1 %>
    <% end %>
  <% end %>
<% end %>
```

### Custom Icon Separators

Using different separator styles:

```ruby
<%# Arrow separator %>
<%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new do %>
  <span class="text-muted-foreground">→</span>
<% end %>

<%# Slash separator %>
<%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new do %>
  <span class="text-muted-foreground">/</span>
<% end %>

<%# Dot separator %>
<%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new do %>
  <span class="text-muted-foreground">•</span>
<% end %>
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

### ❌ Wrong - Missing Component Suffix

```ruby
# This won't work - these are Phlex components
<%= render UI::Breadcrumb::Breadcrumb.new do %>
  ...
<% end %>
```

**Why it's wrong:** ViewComponents have a `Component` suffix. The classes without the suffix are Phlex components.

### ✅ Correct - Use Component Suffix

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  ...
<% end %>
```

### ❌ Wrong - Using ERB Partial Syntax

```ruby
# This is ERB partial syntax, not ViewComponent
<%= render "ui/breadcrumb/breadcrumb" do %>
  ...
<% end %>
```

**Why it's wrong:** ViewComponents use class instances, not string paths.

### ✅ Correct - Use Class Instance

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  ...
<% end %>
```

### ❌ Wrong - Forgetting List Container

```ruby
# Missing BreadcrumbListComponent wrapper
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") { "Home" } %>
  <% end %>
<% end %>
```

**Why it's wrong:** The List component provides essential layout and styling. Without it, items won't display correctly.

### ✅ Correct - Always Include List

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") { "Home" } %>
    <% end %>
  <% end %>
<% end %>
```

### ❌ Wrong - Using Link for Current Page

```ruby
# Don't use BreadcrumbLinkComponent for the current page
<%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "#") { "Current Page" } %>
<% end %>
```

**Why it's wrong:** The current page should not be clickable and needs proper ARIA attributes.

### ✅ Correct - Use Page for Current Page

```ruby
<%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbPageComponent.new { "Current Page" } %>
<% end %>
```

### ❌ Wrong - Forgetting Separators

```ruby
<%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") { "Home" } %>
  <% end %>
  <%# Missing separator! %>
  <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbPageComponent.new { "Page" } %>
  <% end %>
<% end %>
```

**Why it's wrong:** Visual hierarchy is lost without separators between items.

### ✅ Correct - Include Separators Between Items

```ruby
<%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") { "Home" } %>
  <% end %>
  <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
  <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbPageComponent.new { "Page" } %>
  <% end %>
<% end %>
```

### ❌ Wrong - Ellipsis Without DropdownMenu

```ruby
# Just rendering ellipsis alone doesn't provide interaction
<%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbEllipsisComponent.new %>
<% end %>
```

**Why it's wrong:** Ellipsis is meant to indicate hidden items. Without a dropdown, there's no way to access them.

### ✅ Correct - Ellipsis With DropdownMenu

```ruby
<%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
  <%= render UI::DropdownMenu::DropdownMenuComponent.new do %>
    <%= render UI::DropdownMenu::TriggerComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbEllipsisComponent.new %>
    <% end %>
    <%= render UI::DropdownMenu::ContentComponent.new do %>
      <%# Hidden breadcrumb items as menu items %>
    <% end %>
  <% end %>
<% end %>
```

## Integration with Other Components

### With DropdownMenu for Responsive Breadcrumbs

The most common integration pattern - hiding middle breadcrumb items in a dropdown menu:

```ruby
<%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
  <%= render UI::DropdownMenu::DropdownMenuComponent.new do %>
    <%= render UI::DropdownMenu::TriggerComponent.new(classes: "flex items-center gap-1") do %>
      <%= render UI::Breadcrumb::BreadcrumbEllipsisComponent.new %>
      <span class="sr-only">Show more</span>
    <% end %>
    <%= render UI::DropdownMenu::ContentComponent.new(align: "start") do %>
      <%= render UI::DropdownMenu::ItemComponent.new do %>
        <a href="/docs">Documentation</a>
      <% end %>
      <%= render UI::DropdownMenu::ItemComponent.new do %>
        <a href="/themes">Themes</a>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Rails Route Helpers

```ruby
<%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
  <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: root_path) { "Home" } %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: products_path) { "Products" } %>
    <% end %>
    <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
      <%= render UI::Breadcrumb::BreadcrumbPageComponent.new { @product.name } %>
    <% end %>
  <% end %>
<% end %>
```

### With Turbo Frames

```ruby
<%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(
  href: products_path,
  attributes: { "data-turbo-frame": "content" }
) { "Products" } %>
```

### With Additional HTML Attributes

```ruby
<%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(
  href: "/products",
  attributes: { id: "products-link", "data-action": "click->analytics#track" }
) { "Products" } %>
```

## See Also

- Phlex implementation: `docs/llm/phlex/breadcrumb.md`
- ERB implementation: `docs/llm/erb/breadcrumb.md`
- DropdownMenu component: `docs/llm/vc/dropdown_menu.md`
- ViewComponent guide: `docs/llm/vc.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/breadcrumb
