# Table Component - ERB

Data table component with semantic HTML structure using partials.

## Basic Usage

```erb
<%= render "ui/table/table" do %>
  <%= render "ui/table/header" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/head" do %>Name<% end %>
      <%= render "ui/table/head" do %>Email<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/body" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/cell" do %>John Doe<% end %>
      <%= render "ui/table/cell" do %>john@example.com<% end %>
    <% end %>
  <% end %>
<% end %>
```

## Partial Paths

| Component | Partial Path |
|-----------|--------------|
| Table | `ui/table/table` |
| Header | `ui/table/header` |
| Body | `ui/table/body` |
| Footer | `ui/table/footer` |
| Row | `ui/table/row` |
| Head | `ui/table/head` |
| Cell | `ui/table/cell` |
| Caption | `ui/table/caption` |

## Parameters (All Partials)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Table

```erb
<%= render "ui/table/table" do %>
  <%= render "ui/table/header" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/head" do %>Invoice<% end %>
      <%= render "ui/table/head" do %>Status<% end %>
      <%= render "ui/table/head" do %>Amount<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/body" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/cell" do %>INV001<% end %>
      <%= render "ui/table/cell" do %>Paid<% end %>
      <%= render "ui/table/cell" do %>$250.00<% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Caption

```erb
<%= render "ui/table/table" do %>
  <%= render "ui/table/caption" do %>A list of your recent invoices.<% end %>
  <%= render "ui/table/header" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/head" do %>Invoice<% end %>
      <%= render "ui/table/head" do %>Status<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/body" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/cell" do %>INV001<% end %>
      <%= render "ui/table/cell" do %>Paid<% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Footer

```erb
<%= render "ui/table/table" do %>
  <%= render "ui/table/header" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/head" do %>Item<% end %>
      <%= render "ui/table/head" do %>Price<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/body" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/cell" do %>Product A<% end %>
      <%= render "ui/table/cell" do %>$100.00<% end %>
    <% end %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/cell" do %>Product B<% end %>
      <%= render "ui/table/cell" do %>$150.00<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/footer" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/cell" do %>Total<% end %>
      <%= render "ui/table/cell" do %>$250.00<% end %>
    <% end %>
  <% end %>
<% end %>
```

### Dynamic Data

```erb
<%= render "ui/table/table" do %>
  <%= render "ui/table/header" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/head" do %>Name<% end %>
      <%= render "ui/table/head" do %>Email<% end %>
      <%= render "ui/table/head" do %>Role<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/body" do %>
    <% @users.each do |user| %>
      <%= render "ui/table/row" do %>
        <%= render "ui/table/cell" do %><%= user.name %><% end %>
        <%= render "ui/table/cell" do %><%= user.email %><% end %>
        <%= render "ui/table/cell" do %><%= user.role %><% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Custom Classes

```erb
<%= render "ui/table/table", classes: "min-w-full" do %>
  <%= render "ui/table/header" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/head", classes: "w-[100px]" do %>ID<% end %>
      <%= render "ui/table/head", classes: "text-right" do %>Amount<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/body" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/cell", classes: "font-medium" do %>INV001<% end %>
      <%= render "ui/table/cell", classes: "text-right" do %>$250.00<% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Attributes

```erb
<%= render "ui/table/table", attributes: { id: "invoices-table", data: { controller: "sortable" } } do %>
  <%= render "ui/table/header" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/head", attributes: { data: { action: "click->sortable#sort" } } do %>Name<% end %>
      <%= render "ui/table/head" do %>Email<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/body" do %>
    <%= render "ui/table/row", attributes: { data: { id: 1 } } do %>
      <%= render "ui/table/cell" do %>John<% end %>
      <%= render "ui/table/cell" do %>john@example.com<% end %>
    <% end %>
  <% end %>
<% end %>
```

## Common Patterns

### Invoice Table

```erb
<%= render "ui/table/table" do %>
  <%= render "ui/table/caption" do %>A list of your recent invoices.<% end %>
  <%= render "ui/table/header" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/head", classes: "w-[100px]" do %>Invoice<% end %>
      <%= render "ui/table/head" do %>Status<% end %>
      <%= render "ui/table/head" do %>Method<% end %>
      <%= render "ui/table/head", classes: "text-right" do %>Amount<% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/body" do %>
    <% @invoices.each do |invoice| %>
      <%= render "ui/table/row" do %>
        <%= render "ui/table/cell", classes: "font-medium" do %><%= invoice.number %><% end %>
        <%= render "ui/table/cell" do %><%= invoice.status %><% end %>
        <%= render "ui/table/cell" do %><%= invoice.payment_method %><% end %>
        <%= render "ui/table/cell", classes: "text-right" do %><%= number_to_currency(invoice.amount) %><% end %>
      <% end %>
    <% end %>
  <% end %>
  <%= render "ui/table/footer" do %>
    <%= render "ui/table/row" do %>
      <%= render "ui/table/cell", attributes: { colspan: 3 } do %>Total<% end %>
      <%= render "ui/table/cell", classes: "text-right" do %><%= number_to_currency(@invoices.sum(&:amount)) %><% end %>
    <% end %>
  <% end %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing underscore prefix

```erb
<%= render "ui/table/table" %>
# Correct path is "ui/table/table" (without leading underscore)
```

### ✅ Correct: Use the path without underscore

```erb
<%= render "ui/table/table" do %>...<% end %>
```
