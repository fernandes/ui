# Breadcrumb - ERB

## Component Path

```erb
<%= render "ui/breadcrumb/{sub_component}" %>
```

## Description

A navigation breadcrumb component that displays the path to the current resource using a hierarchy of links. Breadcrumbs provide users with context about their location within an application and offer quick navigation to parent pages.

Based on [shadcn/ui Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb).

## Basic Usage

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
        Home
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/components" do %>
        Components
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_page" do %>
        Breadcrumb
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Sub-Components

### ui/breadcrumb/breadcrumb

Main container (`<nav>`) that wraps the breadcrumb navigation. Provides semantic navigation structure with `aria-label="breadcrumb"`.

**Partial:** `app/views/ui/breadcrumb/_breadcrumb.html.erb`

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `attributes:` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

### ui/breadcrumb/breadcrumb_list

Ordered list container (`<ol>`) that holds breadcrumb items. Provides flex layout with proper spacing and text styling.

**Partial:** `app/views/ui/breadcrumb/_breadcrumb_list.html.erb`

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `attributes:` Hash - Any additional HTML attributes

**Base Classes:**
- `flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5`

### ui/breadcrumb/breadcrumb_item

Individual breadcrumb item (`<li>`) that contains a link, page indicator, or ellipsis.

**Partial:** `app/views/ui/breadcrumb/_breadcrumb_item.html.erb`

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `attributes:` Hash - Any additional HTML attributes

**Base Classes:**
- `inline-flex items-center gap-1.5`

### ui/breadcrumb/breadcrumb_link

Clickable link (`<a>`) for navigating to parent pages. Includes hover state with color transition.

**Partial:** `app/views/ui/breadcrumb/_breadcrumb_link.html.erb`

**Parameters:**
- `href:` String - Link destination URL (default: `"#"`)
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `attributes:` Hash - Any additional HTML attributes

**Base Classes:**
- `transition-colors hover:text-foreground`

### ui/breadcrumb/breadcrumb_page

Current page indicator (`<span>`) that represents the active page. Non-clickable with appropriate ARIA attributes.

**Partial:** `app/views/ui/breadcrumb/_breadcrumb_page.html.erb`

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `attributes:` Hash - Any additional HTML attributes

**Base Classes:**
- `font-normal text-foreground`

**ARIA Attributes:**
- `role="link"` - Identifies as a link for screen readers
- `aria-disabled="true"` - Indicates it's not clickable
- `aria-current="page"` - Marks as the current page

### ui/breadcrumb/breadcrumb_separator

Visual divider (`<li>`) between breadcrumb items. Defaults to a chevron-right icon but can accept custom content via block or `content` parameter.

**Partial:** `app/views/ui/breadcrumb/_breadcrumb_separator.html.erb`

**Parameters:**
- `content:` String - Custom separator content (optional)
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `attributes:` Hash - Any additional HTML attributes

**Base Classes:**
- `[&>svg]:size-3.5`

**ARIA Attributes:**
- `role="presentation"` - Indicates decorative element
- `aria-hidden="true"` - Hides from screen readers

**Default Icon:** Chevron right (>)

### ui/breadcrumb/breadcrumb_ellipsis

Collapsed items indicator (`<span>`) showing that some breadcrumb items are hidden. Typically used with DropdownMenu for responsive breadcrumbs.

**Partial:** `app/views/ui/breadcrumb/_breadcrumb_ellipsis.html.erb`

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge (default: `""`)
- `attributes:` Hash - Any additional HTML attributes

**Base Classes:**
- `flex h-9 w-9 items-center justify-center`

**ARIA Attributes:**
- `role="presentation"` - Indicates decorative element
- `aria-hidden="true"` - Hides from screen readers (the dropdown trigger provides proper semantics)

**Default Icon:** Three dots (•••) with "More" screen reader text

## Examples

### Default Breadcrumb

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
        Home
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/components" do %>
        Components
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_page" do %>
        Breadcrumb
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Custom Separator (Block)

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
        Home
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" do %>
      <span class="text-muted-foreground">/</span>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/docs" do %>
        Docs
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" do %>
      <span class="text-muted-foreground">/</span>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_page" do %>
        Components
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Custom Separator (Parameter)

```erb
<%= render "ui/breadcrumb/breadcrumb_separator", content: "→" %>
```

### With Custom Styling

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/", classes: "text-blue-600" do %>
        Home
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/products", classes: "text-blue-600" do %>
        Products
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_page", classes: "font-semibold" do %>
        Laptop
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Responsive Breadcrumb with Dropdown (Collapsed Items)

This is a critical pattern for mobile-responsive breadcrumbs. Use `breadcrumb_ellipsis` inside a DropdownMenu to hide middle items on smaller screens.

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%# First item (always visible) %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
        Home
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>

    <%# Collapsed items in dropdown %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/dropdown_menu/dropdown_menu" do %>
        <%= render "ui/dropdown_menu/dropdown_menu_trigger", classes: "flex items-center gap-1" do %>
          <%= render "ui/breadcrumb/breadcrumb_ellipsis" %>
          <span class="sr-only">Toggle menu</span>
        <% end %>
        <%= render "ui/dropdown_menu/dropdown_menu_content", align: "start" do %>
          <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
            <a href="/docs">Documentation</a>
          <% end %>
          <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
            <a href="/docs/themes">Themes</a>
          <% end %>
          <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
            <a href="/docs/github">GitHub</a>
          <% end %>
        <% end %>
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>

    <%# Last few items (always visible) %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/components" do %>
        Components
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_page" do %>
        Breadcrumb
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Common Patterns

### Simple Navigation Path

For basic page hierarchies:

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
        Home
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_page" do %>
        Settings
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Multi-Level Navigation

For deep page hierarchies:

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
        Home
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/products" do %>
        Products
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/products/electronics" do %>
        Electronics
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/products/electronics/laptops" do %>
        Laptops
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_page" do %>
        MacBook Pro
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Dynamic Breadcrumbs from Array

Programmatic generation from a breadcrumb data structure:

```erb
<%
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "Laptops", href: nil } # nil href indicates current page
  ]
%>

<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <% breadcrumbs.each_with_index do |crumb, index| %>
      <%= render "ui/breadcrumb/breadcrumb_item" do %>
        <% if crumb[:href] %>
          <%= render "ui/breadcrumb/breadcrumb_link", href: crumb[:href] do %>
            <%= crumb[:label] %>
          <% end %>
        <% else %>
          <%= render "ui/breadcrumb/breadcrumb_page" do %>
            <%= crumb[:label] %>
          <% end %>
        <% end %>
      <% end %>

      <%# Add separator unless it's the last item %>
      <%= render "ui/breadcrumb/breadcrumb_separator" unless index == breadcrumbs.length - 1 %>
    <% end %>
  <% end %>
<% end %>
```

### Custom Icon Separators

Using different separator styles:

```erb
<%# Arrow separator %>
<%= render "ui/breadcrumb/breadcrumb_separator" do %>
  <span class="text-muted-foreground">→</span>
<% end %>

<%# Slash separator %>
<%= render "ui/breadcrumb/breadcrumb_separator" do %>
  <span class="text-muted-foreground">/</span>
<% end %>

<%# Dot separator %>
<%= render "ui/breadcrumb/breadcrumb_separator" do %>
  <span class="text-muted-foreground">•</span>
<% end %>

<%# Or using content parameter %>
<%= render "ui/breadcrumb/breadcrumb_separator", content: "→" %>
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

### ❌ Wrong - Using Phlex Syntax

```erb
<%# This is Phlex syntax, not ERB %>
<%= render UI::Breadcrumb::Breadcrumb.new do %>
  ...
<% end %>
```

**Why it's wrong:** ERB uses string paths for partials, not class instances.

### ✅ Correct - Use String Path

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  ...
<% end %>
```

### ❌ Wrong - Missing <%= in Render

```erb
<%# Missing = sign %>
<% render "ui/breadcrumb/breadcrumb" do %>
  ...
<% end %>
```

**Why it's wrong:** Without `=`, the content won't be output to the page.

### ✅ Correct - Use <%= to Output

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  ...
<% end %>
```

### ❌ Wrong - Forgetting List Container

```erb
<%# Missing breadcrumb_list wrapper %>
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_item" do %>
    <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
      Home
    <% end %>
  <% end %>
<% end %>
```

**Why it's wrong:** The List component provides essential layout and styling. Without it, items won't display correctly.

### ✅ Correct - Always Include List

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
        Home
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### ❌ Wrong - Using Link for Current Page

```erb
<%# Don't use breadcrumb_link for the current page %>
<%= render "ui/breadcrumb/breadcrumb_item" do %>
  <%= render "ui/breadcrumb/breadcrumb_link", href: "#" do %>
    Current Page
  <% end %>
<% end %>
```

**Why it's wrong:** The current page should not be clickable and needs proper ARIA attributes.

### ✅ Correct - Use Page for Current Page

```erb
<%= render "ui/breadcrumb/breadcrumb_item" do %>
  <%= render "ui/breadcrumb/breadcrumb_page" do %>
    Current Page
  <% end %>
<% end %>
```

### ❌ Wrong - Forgetting Separators

```erb
<%= render "ui/breadcrumb/breadcrumb_list" do %>
  <%= render "ui/breadcrumb/breadcrumb_item" do %>
    <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
      Home
    <% end %>
  <% end %>
  <%# Missing separator! %>
  <%= render "ui/breadcrumb/breadcrumb_item" do %>
    <%= render "ui/breadcrumb/breadcrumb_page" do %>
      Page
    <% end %>
  <% end %>
<% end %>
```

**Why it's wrong:** Visual hierarchy is lost without separators between items.

### ✅ Correct - Include Separators Between Items

```erb
<%= render "ui/breadcrumb/breadcrumb_list" do %>
  <%= render "ui/breadcrumb/breadcrumb_item" do %>
    <%= render "ui/breadcrumb/breadcrumb_link", href: "/" do %>
      Home
    <% end %>
  <% end %>
  <%= render "ui/breadcrumb/breadcrumb_separator" %>
  <%= render "ui/breadcrumb/breadcrumb_item" do %>
    <%= render "ui/breadcrumb/breadcrumb_page" do %>
      Page
    <% end %>
  <% end %>
<% end %>
```

### ❌ Wrong - Ellipsis Without DropdownMenu

```erb
<%# Just rendering ellipsis alone doesn't provide interaction %>
<%= render "ui/breadcrumb/breadcrumb_item" do %>
  <%= render "ui/breadcrumb/breadcrumb_ellipsis" %>
<% end %>
```

**Why it's wrong:** Ellipsis is meant to indicate hidden items. Without a dropdown, there's no way to access them.

### ✅ Correct - Ellipsis With DropdownMenu

```erb
<%= render "ui/breadcrumb/breadcrumb_item" do %>
  <%= render "ui/dropdown_menu/dropdown_menu" do %>
    <%= render "ui/dropdown_menu/dropdown_menu_trigger" do %>
      <%= render "ui/breadcrumb/breadcrumb_ellipsis" %>
    <% end %>
    <%= render "ui/dropdown_menu/dropdown_menu_content" do %>
      <%# Hidden breadcrumb items as menu items %>
    <% end %>
  <% end %>
<% end %>
```

## Integration with Other Components

### With DropdownMenu for Responsive Breadcrumbs

The most common integration pattern - hiding middle breadcrumb items in a dropdown menu:

```erb
<%= render "ui/breadcrumb/breadcrumb_item" do %>
  <%= render "ui/dropdown_menu/dropdown_menu" do %>
    <%= render "ui/dropdown_menu/dropdown_menu_trigger", classes: "flex items-center gap-1" do %>
      <%= render "ui/breadcrumb/breadcrumb_ellipsis" %>
      <span class="sr-only">Show more</span>
    <% end %>
    <%= render "ui/dropdown_menu/dropdown_menu_content", align: "start" do %>
      <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
        <a href="/docs">Documentation</a>
      <% end %>
      <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
        <a href="/themes">Themes</a>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Rails Route Helpers

```erb
<%= render "ui/breadcrumb/breadcrumb" do %>
  <%= render "ui/breadcrumb/breadcrumb_list" do %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: root_path do %>
        Home
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_link", href: products_path do %>
        Products
      <% end %>
    <% end %>
    <%= render "ui/breadcrumb/breadcrumb_separator" %>
    <%= render "ui/breadcrumb/breadcrumb_item" do %>
      <%= render "ui/breadcrumb/breadcrumb_page" do %>
        <%= @product.name %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Turbo Frames

```erb
<%= render "ui/breadcrumb/breadcrumb_link",
  href: products_path,
  attributes: { "data-turbo-frame": "content" } do %>
  Products
<% end %>
```

### With Additional HTML Attributes

```erb
<%= render "ui/breadcrumb/breadcrumb_link",
  href: "/products",
  attributes: { id: "products-link", "data-action": "click->analytics#track" } do %>
  Products
<% end %>
```

## See Also

- Phlex implementation: `docs/llm/phlex/breadcrumb.md`
- ViewComponent implementation: `docs/llm/vc/breadcrumb.md`
- DropdownMenu component: `docs/llm/erb/dropdown_menu.md`
- ERB guide: `docs/llm/erb.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/breadcrumb
