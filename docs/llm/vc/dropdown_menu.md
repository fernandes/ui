# Dropdown Menu - ViewComponent

## Component Path

```ruby
UI::DropdownMenu::DropdownMenuComponent
```

## Description

Displays a menu to the user—such as a set of actions or functions—triggered by a button. Supports submenus, checkboxes, radio groups, keyboard navigation, and separators.

See full feature list in `docs/llm/phlex/dropdown_menu.md`.

## Basic Usage

```erb
<%= render(UI::DropdownMenu::DropdownMenuComponent.new) do %>
  <%= render(UI::DropdownMenu::TriggerComponent.new) do %>
    <%= render(UI::Button::ButtonComponent.new(variant: :outline)) { "Open" } %>
  <% end %>

  <%= render(UI::DropdownMenu::ContentComponent.new) do %>
    <%= render(UI::DropdownMenu::ItemComponent.new) { "Profile" } %>
    <%= render(UI::DropdownMenu::ItemComponent.new) { "Settings" } %>
    <%= render(UI::DropdownMenu::SeparatorComponent.new) %>
    <%= render(UI::DropdownMenu::ItemComponent.new) { "Logout" } %>
  <% end %>
<% end %>
```

## Available Components

| Component | Class Name |
|-----------|------------|
| DropdownMenu | `DropdownMenuComponent` |
| Trigger | `TriggerComponent` |
| Content | `ContentComponent` |
| Item | `ItemComponent` |
| Label | `LabelComponent` |
| Separator | `SeparatorComponent` |
| Shortcut | `ShortcutComponent` |
| CheckboxItem | `CheckboxItemComponent` |
| RadioGroup | `RadioGroupComponent` |
| RadioItem | `RadioItemComponent` |
| Sub | `SubComponent` |
| SubTrigger | `SubTriggerComponent` |
| SubContent | `SubContentComponent` |

## Examples

### With Checkboxes

```erb
<%= render(UI::DropdownMenu::DropdownMenuComponent.new) do %>
  <%= render(UI::DropdownMenu::TriggerComponent.new) do %>
    <%= render(UI::Button::ButtonComponent.new(variant: :outline)) { "View" } %>
  <% end %>

  <%= render(UI::DropdownMenu::ContentComponent.new) do %>
    <%= render(UI::DropdownMenu::CheckboxItemComponent.new(checked: true)) { "Show Sidebar" } %>
    <%= render(UI::DropdownMenu::CheckboxItemComponent.new(checked: false)) { "Show Toolbar" } %>
  <% end %>
<% end %>
```

### With Radio Group

```erb
<%= render(UI::DropdownMenu::DropdownMenuComponent.new) do %>
  <%= render(UI::DropdownMenu::TriggerComponent.new) do %>
    <%= render(UI::Button::ButtonComponent.new(variant: :outline)) { "Position" } %>
  <% end %>

  <%= render(UI::DropdownMenu::ContentComponent.new) do %>
    <%= render(UI::DropdownMenu::RadioGroupComponent.new) do %>
      <%= render(UI::DropdownMenu::RadioItemComponent.new(value: "top", checked: true)) { "Top" } %>
      <%= render(UI::DropdownMenu::RadioItemComponent.new(value: "bottom")) { "Bottom" } %>
    <% end %>
  <% end %>
<% end %>
```

### With Submenu

```erb
<%= render(UI::DropdownMenu::DropdownMenuComponent.new) do %>
  <%= render(UI::DropdownMenu::TriggerComponent.new) do %>
    <%= render(UI::Button::ButtonComponent.new(variant: :outline)) { "More" } %>
  <% end %>

  <%= render(UI::DropdownMenu::ContentComponent.new) do %>
    <%= render(UI::DropdownMenu::ItemComponent.new) { "Profile" } %>
    <%= render(UI::DropdownMenu::SeparatorComponent.new) %>
    <%= render(UI::DropdownMenu::SubComponent.new) do %>
      <%= render(UI::DropdownMenu::SubTriggerComponent.new) { "Share" } %>
      <%= render(UI::DropdownMenu::SubContentComponent.new) do %>
        <%= render(UI::DropdownMenu::ItemComponent.new) { "Email" } %>
        <%= render(UI::DropdownMenu::ItemComponent.new) { "Message" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## See Also

- ViewComponent guide: `docs/llm/vc.md`
- Phlex implementation: `docs/llm/phlex/dropdown_menu.md`
- ERB implementation: `docs/llm/erb/dropdown_menu.md`
