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

## Accessibility

- **Name**: give the menu an accessible name with `aria-label` on the content
  (`render "ui/context_menu/content", attributes: { "aria-label": "Page actions" }`).
- **Checkbox / radio items** toggle on click, Space (menu stays open) and Enter (menu closes).
- **Disabled**: `disabled: true` on `item`, `checkbox_item` and `radio_item` renders `aria-disabled="true"` + `data-disabled`; disabled items are
  skipped by the arrow keys and typeahead and can't be activated.
- **Keyboard**: the keyboard's context-menu key / Shift+F10 opens the menu at the focused element.
  Arrows (looping), Home/End, typeahead (type the start of an item's label; `data-text-value`
  overrides it), Enter/Space activate.
- **Closing**: Escape (layered: inside a Dialog it closes only the menu), selecting an item and Tab
  return focus to the element that had it when the menu opened. Focus leaving the menu, a click or a
  right-click outside it, or opening another context menu close it too.

## See Also

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/context_menu.md`
- ViewComponent implementation: `docs/llm/vc/context_menu.md`
