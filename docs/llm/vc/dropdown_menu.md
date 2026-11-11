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

## Accessibility

- **Trigger**: with text/icon content the trigger renders a `<button type="button">`. When you
  pass your own button or link as content, the trigger renders a plain wrapper (no role, no
  tabindex) and the controller puts `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`
  on your element: one tab stop, no nested interactive elements. `as_child` hands the same
  attributes to your child.
- **Ids**: the menu gets a unique id on connect and is labelled by the trigger; sub triggers get
  `aria-haspopup="menu"`, `aria-expanded` and `aria-controls` → their submenu. An `id` you pass is kept.
- **Disabled**: `disabled: true` on `UI::DropdownMenuItemComponent`, `UI::DropdownMenuSubTriggerComponent`, `UI::DropdownMenuCheckboxItemComponent` and `UI::DropdownMenuRadioItemComponent` renders `aria-disabled="true"` + `data-disabled`; disabled items are
  skipped by the arrow keys and typeahead and can't be activated.
- **Keyboard**: Enter/Space/ArrowDown on the trigger open on the first item, ArrowUp on the last.
  In the menu: arrows (looping), Home/End, typeahead (type the start of an item's label; set
  `data-text-value` to override), ArrowRight/Enter/Space open a submenu, ArrowLeft/Escape close it.
  Enter on a checkbox/radio item toggles and closes, Space toggles and keeps the menu open.
- **Focus**: Escape (outermost level), selecting an item (keyboard or pointer) and Tab return focus
  to the trigger. Escape is layered: inside a Dialog it closes only the menu.
- Text fields inside a submenu (e.g. a Command search) keep Space, Home/End and ←/→.

## See Also

- ViewComponent guide: `docs/llm/vc.md`
- Phlex implementation: `docs/llm/phlex/dropdown_menu.md`
- ERB implementation: `docs/llm/erb/dropdown_menu.md`
