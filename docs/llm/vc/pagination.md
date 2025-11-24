# Pagination Component - ViewComponent

Display navigation controls for paginated content with page numbers, previous/next links, and ellipsis indicators.

## All Components

1. **UI::Pagination::PaginationComponent** - Root container
2. **UI::Pagination::PaginationContentComponent** - List wrapper
3. **UI::Pagination::PaginationItemComponent** - List item
4. **UI::Pagination::PaginationLinkComponent** - Page number link
5. **UI::Pagination::PaginationPreviousComponent** - Previous button
6. **UI::Pagination::PaginationNextComponent** - Next button
7. **UI::Pagination::PaginationEllipsisComponent** - Ellipsis (...)

## Basic Usage

**IMPORTANT**: Always use parentheses with ViewComponent when passing blocks:

```ruby
<%= render(UI::Pagination::PaginationComponent.new) do %>
  <%= render(UI::Pagination::PaginationContentComponent.new) do %>
    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationPreviousComponent.new(href: "/page/1")) %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationLinkComponent.new(href: "/page/1")) { "1" } %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationLinkComponent.new(href: "/page/2", active: true)) { "2" } %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationLinkComponent.new(href: "/page/3")) { "3" } %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationNextComponent.new(href: "/page/3")) %>
    <% end %>
  <% end %>
<% end %>
```

## With Ellipsis

```ruby
<%= render(UI::Pagination::PaginationComponent.new) do %>
  <%= render(UI::Pagination::PaginationContentComponent.new) do %>
    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationPreviousComponent.new(href: "/page/4")) %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationLinkComponent.new(href: "/page/1")) { "1" } %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationEllipsisComponent.new) %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationLinkComponent.new(href: "/page/5", active: true)) { "5" } %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationEllipsisComponent.new) %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationLinkComponent.new(href: "/page/10")) { "10" } %>
    <% end %>

    <%= render(UI::Pagination::PaginationItemComponent.new) do %>
      <%= render(UI::Pagination::PaginationNextComponent.new(href: "/page/6")) %>
    <% end %>
  <% end %>
<% end %>
```

## Parameters

### PaginationLinkComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | String | `"#"` | URL for the link |
| `active` | Boolean | `false` | Current page indicator |
| `size` | String | `"icon"` | Size variant |
| `classes` | String | `""` | Additional classes |
| `attributes` | Hash | `{}` | Additional attributes |

### PaginationPreviousComponent / PaginationNextComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | String | `"#"` | URL for navigation |
| `classes` | String | `""` | Additional classes |
| `attributes` | Hash | `{}` | Additional attributes |

## Error Prevention

### ❌ Wrong: Missing parentheses

```ruby
<%= render UI::Pagination::PaginationComponent.new do %>
  <%# Block won't be passed correctly %>
<% end %>
```

### ✅ Correct: Use parentheses

```ruby
<%= render(UI::Pagination::PaginationComponent.new) do %>
  <%# Correct! %>
<% end %>
```

## Reference

- **shadcn/ui**: https://ui.shadcn.com/docs/components/pagination
