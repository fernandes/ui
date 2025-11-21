# Context Menu - ViewComponent

## Component Path

```ruby
UI::ContextMenu::ContextMenuComponent
```

## Description

Displays a menu to the user—such as a set of actions or functions—triggered by a right-click. ViewComponent implementation.

## Basic Usage

```erb
<%= render(UI::ContextMenu::ContextMenuComponent.new) do %>
  <%= render(UI::ContextMenu::TriggerComponent.new) do %>
    Right click here
  <% end %>

  <%= render(UI::ContextMenu::ContentComponent.new) do %>
    <%= render(UI::ContextMenu::ItemComponent.new) { "Back" } %>
    <%= render(UI::ContextMenu::ItemComponent.new) { "Forward" } %>
    <%= render(UI::ContextMenu::SeparatorComponent.new) %>
    <%= render(UI::ContextMenu::ItemComponent.new) { "Reload" } %>
  <% end %>
<% end %>
```

## Available Components

### ContextMenuComponent

Main container component.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### TriggerComponent

Area that triggers the context menu on right-click.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### ContentComponent

Container for menu items.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### ItemComponent

Individual menu item.

**Parameters:**
- `href:` String - Optional URL to make item a link
- `inset:` Boolean - Add left padding (default: false)
- `variant:` String - "default" or "destructive" (default: "default")
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### LabelComponent

Section header/label.

**Parameters:**
- `inset:` Boolean - Add left padding (default: false)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### SeparatorComponent

Visual separator between items.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### ShortcutComponent

Keyboard shortcut indicator.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### CheckboxItemComponent

Menu item with checkbox state.

**Parameters:**
- `checked:` Boolean - Whether checked (default: false)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### RadioGroupComponent

Container for radio items.

**Parameters:**
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

### RadioItemComponent

Radio selection item.

**Parameters:**
- `checked:` Boolean - Whether checked (default: false)
- `classes:` String - Additional CSS classes
- `**attributes` Hash - Additional HTML attributes

## Examples

### With Labels and Shortcuts

```erb
<%= render(UI::ContextMenu::ContextMenuComponent.new) do %>
  <%= render(UI::ContextMenu::TriggerComponent.new) do %>
    Right click for options
  <% end %>

  <%= render(UI::ContextMenu::ContentComponent.new(classes: "w-56")) do %>
    <%= render(UI::ContextMenu::LabelComponent.new) { "My Account" } %>
    <%= render(UI::ContextMenu::SeparatorComponent.new) %>
    <%= render(UI::ContextMenu::ItemComponent.new) { "Profile" } %>
    <%= render(UI::ContextMenu::ItemComponent.new) { "Team" } %>
    <%= render(UI::ContextMenu::SeparatorComponent.new) %>
    <%= render(UI::ContextMenu::ItemComponent.new(variant: "destructive")) { "Delete Account" } %>
  <% end %>
<% end %>
```

### With Checkboxes

```erb
<%= render(UI::ContextMenu::ContextMenuComponent.new) do %>
  <%= render(UI::ContextMenu::TriggerComponent.new) do %>
    Right click for view options
  <% end %>

  <%= render(UI::ContextMenu::ContentComponent.new) do %>
    <%= render(UI::ContextMenu::CheckboxItemComponent.new(checked: true)) { "Show Status Bar" } %>
    <%= render(UI::ContextMenu::CheckboxItemComponent.new) { "Show Full URLs" } %>
  <% end %>
<% end %>
```

### With Radio Group

```erb
<%= render(UI::ContextMenu::ContextMenuComponent.new) do %>
  <%= render(UI::ContextMenu::TriggerComponent.new) do %>
    Right click for people
  <% end %>

  <%= render(UI::ContextMenu::ContentComponent.new) do %>
    <%= render(UI::ContextMenu::RadioGroupComponent.new) do %>
      <%= render(UI::ContextMenu::LabelComponent.new(inset: true)) { "People" } %>
      <%= render(UI::ContextMenu::SeparatorComponent.new) %>
      <%= render(UI::ContextMenu::RadioItemComponent.new(checked: true)) { "Pedro Duarte" } %>
      <%= render(UI::ContextMenu::RadioItemComponent.new) { "Colm Tuite" } %>
    <% end %>
  <% end %>
<% end %>
```

## See Also

- ViewComponent guide: `docs/llm/vc.md`
- Phlex implementation: `docs/llm/phlex/context_menu.md`
- ERB implementation: `docs/llm/erb/context_menu.md`
