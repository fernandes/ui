# Context Menu - ERB

## Partial Path

```erb
render "ui/context_menu/context_menu"
```

## Description

Displays a menu to the user—such as a set of actions or functions—triggered by a right-click. ERB partials implementation.

## Basic Usage

```erb
<%= render "ui/context_menu/context_menu" do %>
  <%= render "ui/context_menu/context_menu_trigger" do %>
    Right click here
  <% end %>

  <%= render "ui/context_menu/context_menu_content" do %>
    <%= render "ui/context_menu/context_menu_item" do %>
      Back
    <% end %>
    <%= render "ui/context_menu/context_menu_item" do %>
      Forward
    <% end %>
  <% end %>
<% end %>
```

## Available Partials

### context_menu

Main container partial.

**Local assigns:**
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_trigger

Area that triggers the context menu on right-click.

**Local assigns:**
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_content

Container for menu items.

**Local assigns:**
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_item

Individual menu item.

**Local assigns:**
- `href:` String - Optional URL to make item a link
- `inset:` Boolean - Add left padding (default: false)
- `variant:` String - "default" or "destructive" (default: "default")
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_label

Section header/label.

**Local assigns:**
- `inset:` Boolean - Add left padding (default: false)
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_separator

Visual separator between items.

**Local assigns:**
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_shortcut

Keyboard shortcut indicator.

**Local assigns:**
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_checkbox_item

Menu item with checkbox state.

**Local assigns:**
- `checked:` Boolean - Whether checked (default: false)
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_radio_group

Container for radio items.

**Local assigns:**
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

### context_menu_radio_item

Radio selection item.

**Local assigns:**
- `checked:` Boolean - Whether checked (default: false)
- `classes:` String - Additional CSS classes
- `attributes:` Hash - Additional HTML attributes

## Examples

### With Labels and Shortcuts

```erb
<%= render "ui/context_menu/context_menu" do %>
  <%= render "ui/context_menu/context_menu_trigger" do %>
    Right click for file options
  <% end %>

  <%= render "ui/context_menu/context_menu_content", classes: "w-56" do %>
    <%= render "ui/context_menu/context_menu_label" do %>
      File
    <% end %>
    <%= render "ui/context_menu/context_menu_separator" %>
    <%= render "ui/context_menu/context_menu_item" do %>
      New File
      <%= render "ui/context_menu/context_menu_shortcut" do %>
        ⌘N
      <% end %>
    <% end %>
    <%= render "ui/context_menu/context_menu_item" do %>
      Save
      <%= render "ui/context_menu/context_menu_shortcut" do %>
        ⌘S
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Checkboxes

```erb
<%= render "ui/context_menu/context_menu" do %>
  <%= render "ui/context_menu/context_menu_trigger" do %>
    Right click for view options
  <% end %>

  <%= render "ui/context_menu/context_menu_content" do %>
    <%= render "ui/context_menu/context_menu_checkbox_item", checked: true do %>
      Show Status Bar
    <% end %>
    <%= render "ui/context_menu/context_menu_checkbox_item" do %>
      Show Full URLs
    <% end %>
  <% end %>
<% end %>
```

### Destructive Item

```erb
<%= render "ui/context_menu/context_menu" do %>
  <%= render "ui/context_menu/context_menu_trigger" do %>
    Right click for actions
  <% end %>

  <%= render "ui/context_menu/context_menu_content", classes: "w-48" do %>
    <%= render "ui/context_menu/context_menu_item" do %>
      Edit
    <% end %>
    <%= render "ui/context_menu/context_menu_item" do %>
      Duplicate
    <% end %>
    <%= render "ui/context_menu/context_menu_separator" %>
    <%= render "ui/context_menu/context_menu_item", variant: "destructive" do %>
      Delete
    <% end %>
  <% end %>
<% end %>
```

## See Also

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/context_menu.md`
- ViewComponent implementation: `docs/llm/vc/context_menu.md`
