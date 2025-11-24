# Pagination Component - Phlex

Display navigation controls for paginated content with page numbers, previous/next links, and ellipsis indicators.

## Overview

The Pagination component system consists of 7 composable sub-components for building flexible pagination controls:

1. **UI::Pagination::Pagination** - Root container
2. **UI::Pagination::Content** - List wrapper for items
3. **UI::Pagination::Item** - Individual list item wrapper
4. **UI::Pagination::Link** - Page number link
5. **UI::Pagination::Previous** - Previous page button
6. **UI::Pagination::Next** - Next page button
7. **UI::Pagination::Ellipsis** - Overflow indicator (...)

## Component Hierarchy

```
UI::Pagination::Pagination (nav)
└── UI::Pagination::Content (ul)
    ├── UI::Pagination::Item (li)
    │   └── UI::Pagination::Previous (link with icon)
    ├── UI::Pagination::Item (li)
    │   └── UI::Pagination::Link (page number)
    ├── UI::Pagination::Item (li)
    │   └── UI::Pagination::Ellipsis (...)
    └── UI::Pagination::Item (li)
        └── UI::Pagination::Next (link with icon)
```

## All Components

### 1. UI::Pagination::Pagination

**Path**: `app/components/ui/pagination/pagination.rb`

Root container with semantic navigation role.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Pagination::Pagination.new do %>
  <%# Content goes here %>
<% end %>
```

### 2. UI::Pagination::Content

**Path**: `app/components/ui/pagination/content.rb`

List container for pagination items.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Pagination::Content.new do %>
  <%# Items go here %>
<% end %>
```

### 3. UI::Pagination::Item

**Path**: `app/components/ui/pagination/item.rb`

List item wrapper for pagination elements.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Pagination::Item.new do %>
  <%# Link or button goes here %>
<% end %>
```

### 4. UI::Pagination::Link

**Path**: `app/components/ui/pagination/link.rb`

Interactive page number link.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | String | `"#"` | URL for the link |
| `active` | Boolean | `false` | Whether this is the current page |
| `size` | String | `"icon"` | Size: `"icon"`, `"default"`, `"sm"`, `"lg"` |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Pagination::Link.new(href: "/page/1") { "1" } %>
<%= render UI::Pagination::Link.new(href: "/page/2", active: true) { "2" } %>
```

### 5. UI::Pagination::Previous

**Path**: `app/components/ui/pagination/previous.rb`

Previous page button with chevron icon and "Previous" text.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | String | `"#"` | URL for the previous page |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Pagination::Previous.new(href: "/page/1") %>
```

### 6. UI::Pagination::Next

**Path**: `app/components/ui/pagination/next.rb`

Next page button with "Next" text and chevron icon.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | String | `"#"` | URL for the next page |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Pagination::Next.new(href: "/page/3") %>
```

### 7. UI::Pagination::Ellipsis

**Path**: `app/components/ui/pagination/ellipsis.rb`

Ellipsis indicator for skipped page numbers.

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Pagination::Ellipsis.new %>
```

## Basic Usage

### Simple Pagination

```ruby
<%= render UI::Pagination::Pagination.new do %>
  <%= render UI::Pagination::Content.new do %>
    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Previous.new(href: "/page/1") %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Link.new(href: "/page/1") { "1" } %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Link.new(href: "/page/2", active: true) { "2" } %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Link.new(href: "/page/3") { "3" } %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Next.new(href: "/page/3") %>
    <% end %>
  <% end %>
<% end %>
```

### With Ellipsis

```ruby
<%= render UI::Pagination::Pagination.new do %>
  <%= render UI::Pagination::Content.new do %>
    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Previous.new(href: "/page/4") %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Link.new(href: "/page/1") { "1" } %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Ellipsis.new %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Link.new(href: "/page/4") { "4" } %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Link.new(href: "/page/5", active: true) { "5" } %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Link.new(href: "/page/6") { "6" } %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Ellipsis.new %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Link.new(href: "/page/10") { "10" } %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Next.new(href: "/page/6") %>
    <% end %>
  <% end %>
<% end %>
```

## Common Patterns

### With Rails Routes

```ruby
<%= render UI::Pagination::Pagination.new do %>
  <%= render UI::Pagination::Content.new do %>
    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Previous.new(href: posts_path(page: @page - 1)) %>
    <% end %>

    <% (1..@total_pages).each do |page_num| %>
      <%= render UI::Pagination::Item.new do %>
        <%= render UI::Pagination::Link.new(
          href: posts_path(page: page_num),
          active: page_num == @page
        ) { page_num } %>
      <% end %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Next.new(href: posts_path(page: @page + 1)) %>
    <% end %>
  <% end %>
<% end %>
```

### Disabled Previous/Next

```ruby
<%# When on first page, previous is disabled %>
<% if @page > 1 %>
  <%= render UI::Pagination::Item.new do %>
    <%= render UI::Pagination::Previous.new(href: "/page/#{@page - 1}") %>
  <% end %>
<% else %>
  <%= render UI::Pagination::Item.new do %>
    <%= render UI::Pagination::Link.new(
      href: "#",
      classes: "pointer-events-none opacity-50"
    ) do %>
      <svg class="size-4"><path d="m15 18-6-6 6-6"/></svg>
      <span class="hidden sm:block">Previous</span>
    <% end %>
  <% end %>
<% end %>

<%# When on last page, next is disabled %>
<% if @page < @total_pages %>
  <%= render UI::Pagination::Item.new do %>
    <%= render UI::Pagination::Next.new(href: "/page/#{@page + 1}") %>
  <% end %>
<% else %>
  <%= render UI::Pagination::Item.new do %>
    <%= render UI::Pagination::Link.new(
      href: "#",
      classes: "pointer-events-none opacity-50"
    ) do %>
      <span class="hidden sm:block">Next</span>
      <svg class="size-4"><path d="m9 18 6-6-6-6"/></svg>
    <% end %>
  <% end %>
<% end %>
```

### Smart Ellipsis Logic

```ruby
<%
  current_page = 5
  total_pages = 20
  delta = 1  # Show 1 page before/after current

  # Calculate page range
  left_range = [1]
  middle_range = ((current_page - delta)..(current_page + delta)).to_a.select { |p| p > 1 && p < total_pages }
  right_range = [total_pages]

  # Determine if ellipsis is needed
  show_left_ellipsis = middle_range.first && middle_range.first > 2
  show_right_ellipsis = middle_range.last && middle_range.last < total_pages - 1
%>

<%= render UI::Pagination::Pagination.new do %>
  <%= render UI::Pagination::Content.new do %>
    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Previous.new(href: "/page/#{current_page - 1}") %>
    <% end %>

    <%# First page %>
    <% left_range.each do |page_num| %>
      <%= render UI::Pagination::Item.new do %>
        <%= render UI::Pagination::Link.new(
          href: "/page/#{page_num}",
          active: page_num == current_page
        ) { page_num } %>
      <% end %>
    <% end %>

    <%# Left ellipsis %>
    <% if show_left_ellipsis %>
      <%= render UI::Pagination::Item.new do %>
        <%= render UI::Pagination::Ellipsis.new %>
      <% end %>
    <% end %>

    <%# Middle pages %>
    <% middle_range.each do |page_num| %>
      <%= render UI::Pagination::Item.new do %>
        <%= render UI::Pagination::Link.new(
          href: "/page/#{page_num}",
          active: page_num == current_page
        ) { page_num } %>
      <% end %>
    <% end %>

    <%# Right ellipsis %>
    <% if show_right_ellipsis %>
      <%= render UI::Pagination::Item.new do %>
        <%= render UI::Pagination::Ellipsis.new %>
      <% end %>
    <% end %>

    <%# Last page %>
    <% right_range.each do |page_num| %>
      <%= render UI::Pagination::Item.new do %>
        <%= render UI::Pagination::Link.new(
          href: "/page/#{page_num}",
          active: page_num == current_page
        ) { page_num } %>
      <% end %>
    <% end %>

    <%= render UI::Pagination::Item.new do %>
      <%= render UI::Pagination::Next.new(href: "/page/#{current_page + 1}") %>
    <% end %>
  <% end %>
<% end %>
```

## Accessibility

- Uses semantic `<nav>` element with `role="navigation"`
- Includes `aria-label="pagination"` on root
- Active page has `aria-current="page"`
- Previous/Next have `aria-label` attributes
- Ellipsis has `aria-hidden="true"` with screen reader text "More pages"

## Reference

- **shadcn/ui**: https://ui.shadcn.com/docs/components/pagination
- **MDN nav element**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
