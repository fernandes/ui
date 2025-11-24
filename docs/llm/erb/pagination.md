# Pagination Component - ERB

Display navigation controls for paginated content with page numbers, previous/next links, and ellipsis indicators.

## All Components

1. **ui/pagination/pagination** - Root container (nav)
2. **ui/pagination/pagination_content** - List wrapper (ul)
3. **ui/pagination/pagination_item** - List item (li)
4. **ui/pagination/pagination_link** - Page number link
5. **ui/pagination/pagination_previous** - Previous button with icon
6. **ui/pagination/pagination_next** - Next button with icon
7. **ui/pagination/pagination_ellipsis** - Overflow indicator (...)

## Basic Usage

```erb
<%= render "ui/pagination/pagination" do %>
  <%= render "ui/pagination/pagination_content" do %>
    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_previous", href: "/page/1" %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_link", href: "/page/1" do %>1<% end %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_link", href: "/page/2", active: true do %>2<% end %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_link", href: "/page/3" do %>3<% end %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_next", href: "/page/3" %>
    <% end %>
  <% end %>
<% end %>
```

## With Ellipsis

```erb
<%= render "ui/pagination/pagination" do %>
  <%= render "ui/pagination/pagination_content" do %>
    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_previous", href: "/page/4" %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_link", href: "/page/1" do %>1<% end %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_ellipsis" %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_link", href: "/page/5", active: true do %>5<% end %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_ellipsis" %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_link", href: "/page/10" do %>10<% end %>
    <% end %>

    <%= render "ui/pagination/pagination_item" do %>
      <%= render "ui/pagination/pagination_next", href: "/page/6" %>
    <% end %>
  <% end %>
<% end %>
```

## Parameters

### pagination_link

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | String | `"#"` | URL for the link |
| `active` | Boolean | `false` | Current page indicator |
| `size` | String | `"icon"` | Size variant |
| `classes` | String | `""` | Additional classes |
| `attributes` | Hash | `{}` | Additional attributes |

### pagination_previous / pagination_next

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | String | `"#"` | URL for navigation |
| `classes` | String | `""` | Additional classes |
| `attributes` | Hash | `{}` | Additional attributes |

## Reference

- **shadcn/ui**: https://ui.shadcn.com/docs/components/pagination
