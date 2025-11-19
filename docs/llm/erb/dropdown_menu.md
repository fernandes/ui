# Dropdown Menu - ERB

## Component Path

```erb
<%= render "ui/dropdown_menu/dropdown_menu" %>
```

## Description

Displays a menu to the user—such as a set of actions or functions—triggered by a button. Supports submenus, checkboxes, radio groups, keyboard navigation, and separators.

See full feature list in `docs/llm/phlex/dropdown_menu.md`.

## Basic Usage

```erb
<%= render "ui/dropdown_menu/dropdown_menu" do %>
  <%= render "ui/dropdown_menu/dropdown_menu_trigger" do %>
    <%= render "ui/button/button", variant: :outline do %>
      Open
    <% end %>
  <% end %>

  <%= render "ui/dropdown_menu/dropdown_menu_content" do %>
    <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
      Profile
    <% end %>
    <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
      Settings
    <% end %>
    <%= render "ui/dropdown_menu/dropdown_menu_separator" %>
    <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
      Logout
    <% end %>
  <% end %>
<% end %>
```

## Available Partials

| Partial | Purpose |
|---------|---------|
| `_dropdown_menu.html.erb` | Main container |
| `_dropdown_menu_trigger.html.erb` | Trigger wrapper |
| `_dropdown_menu_content.html.erb` | Menu content container |
| `_dropdown_menu_item.html.erb` | Menu item |
| `_dropdown_menu_label.html.erb` | Section label |
| `_dropdown_menu_separator.html.erb` | Visual separator |
| `_dropdown_menu_shortcut.html.erb` | Keyboard shortcut |
| `_dropdown_menu_checkbox_item.html.erb` | Checkbox item |
| `_dropdown_menu_radio_group.html.erb` | Radio group container |
| `_dropdown_menu_radio_item.html.erb` | Radio item |
| `_dropdown_menu_sub.html.erb` | Submenu container |
| `_dropdown_menu_sub_trigger.html.erb` | Submenu trigger |
| `_dropdown_menu_sub_content.html.erb` | Submenu content |

## Examples

### With Checkboxes

```erb
<%= render "ui/dropdown_menu/dropdown_menu" do %>
  <%= render "ui/dropdown_menu/dropdown_menu_trigger" do %>
    <%= render "ui/button/button", variant: :outline do %>
      View
    <% end %>
  <% end %>

  <%= render "ui/dropdown_menu/dropdown_menu_content" do %>
    <%= render "ui/dropdown_menu/dropdown_menu_checkbox_item", checked: true do %>
      Show Sidebar
    <% end %>
    <%= render "ui/dropdown_menu/dropdown_menu_checkbox_item", checked: false do %>
      Show Toolbar
    <% end %>
  <% end %>
<% end %>
```

### With Radio Group

```erb
<%= render "ui/dropdown_menu/dropdown_menu" do %>
  <%= render "ui/dropdown_menu/dropdown_menu_trigger" do %>
    <%= render "ui/button/button", variant: :outline do %>
      Position
    <% end %>
  <% end %>

  <%= render "ui/dropdown_menu/dropdown_menu_content" do %>
    <%= render "ui/dropdown_menu/dropdown_menu_radio_group" do %>
      <%= render "ui/dropdown_menu/dropdown_menu_radio_item", value: "top", checked: true do %>
        Top
      <% end %>
      <%= render "ui/dropdown_menu/dropdown_menu_radio_item", value: "bottom" do %>
        Bottom
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Submenu

```erb
<%= render "ui/dropdown_menu/dropdown_menu" do %>
  <%= render "ui/dropdown_menu/dropdown_menu_trigger" do %>
    <%= render "ui/button/button", variant: :outline do %>
      More
    <% end %>
  <% end %>

  <%= render "ui/dropdown_menu/dropdown_menu_content" do %>
    <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
      Profile
    <% end %>
    <%= render "ui/dropdown_menu/dropdown_menu_separator" %>
    <%= render "ui/dropdown_menu/dropdown_menu_sub" do %>
      <%= render "ui/dropdown_menu/dropdown_menu_sub_trigger" do %>
        Share
      <% end %>
      <%= render "ui/dropdown_menu/dropdown_menu_sub_content" do %>
        <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
          Email
        <% end %>
        <%= render "ui/dropdown_menu/dropdown_menu_item" do %>
          Message
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## See Also

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/dropdown_menu.md`
- ViewComponent implementation: `docs/llm/vc/dropdown_menu.md`
