# Command Component - ViewComponent

Fast, composable command palette for searching and selecting items.

## Basic Usage

```erb
<%= render(UI::Command::CommandComponent.new(classes: "rounded-lg border shadow-md")) do %>
  <%= render(UI::Command::InputComponent.new(placeholder: "Search...")) %>
  <%= render(UI::Command::ListComponent.new) do %>
    <%= render(UI::Command::EmptyComponent.new) { "No results found." } %>
    <%= render(UI::Command::GroupComponent.new(heading: "Suggestions")) do %>
      <%= render(UI::Command::ItemComponent.new(value: "calendar")) do %>
        <%= lucide_icon("calendar", class: "mr-2 h-4 w-4") %>
        <span>Calendar</span>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Component Paths

| Component | Class | File |
|-----------|-------|------|
| Command | `UI::Command::CommandComponent` | `app/components/ui/command/command_component.rb` |
| Input | `UI::Command::InputComponent` | `app/components/ui/command/input_component.rb` |
| List | `UI::Command::ListComponent` | `app/components/ui/command/list_component.rb` |
| Empty | `UI::Command::EmptyComponent` | `app/components/ui/command/empty_component.rb` |
| Group | `UI::Command::GroupComponent` | `app/components/ui/command/group_component.rb` |
| Item | `UI::Command::ItemComponent` | `app/components/ui/command/item_component.rb` |
| Separator | `UI::Command::SeparatorComponent` | `app/components/ui/command/separator_component.rb` |
| Shortcut | `UI::Command::ShortcutComponent` | `app/components/ui/command/shortcut_component.rb` |
| Dialog | `UI::Command::DialogComponent` | `app/components/ui/command/dialog_component.rb` |

## Parameters

### CommandComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `loop` | Boolean | `true` | Loop navigation at boundaries |
| `classes` | String | `""` | Additional CSS classes |

### InputComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | String | `"Type a command or search..."` | Input placeholder |
| `classes` | String | `""` | Additional CSS classes |

### GroupComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | String | `nil` | Group heading text |
| `classes` | String | `""` | Additional CSS classes |

### ItemComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | String | `nil` | Value for filtering/selection |
| `disabled` | Boolean | `false` | Whether item is disabled |
| `classes` | String | `""` | Additional CSS classes |

### DialogComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `shortcut` | String | `"meta+j"` | Keyboard shortcut to open dialog (uses Stimulus keyboard filter syntax) |
| `classes` | String | `""` | Additional CSS classes |

## Examples

### Full Command Palette

```erb
<%= render(UI::Command::CommandComponent.new(classes: "rounded-lg border shadow-md md:min-w-[450px]")) do %>
  <%= render(UI::Command::InputComponent.new(placeholder: "Type a command or search...")) %>
  <%= render(UI::Command::ListComponent.new) do %>
    <%= render(UI::Command::EmptyComponent.new) { "No results found." } %>
    <%= render(UI::Command::GroupComponent.new(heading: "Suggestions")) do %>
      <%= render(UI::Command::ItemComponent.new(value: "calendar")) do %>
        <%= lucide_icon("calendar", class: "mr-2 h-4 w-4") %>
        <span>Calendar</span>
      <% end %>
      <%= render(UI::Command::ItemComponent.new(value: "calculator")) do %>
        <%= lucide_icon("calculator", class: "mr-2 h-4 w-4") %>
        <span>Calculator</span>
      <% end %>
    <% end %>
    <%= render(UI::Command::SeparatorComponent.new) %>
    <%= render(UI::Command::GroupComponent.new(heading: "Settings")) do %>
      <%= render(UI::Command::ItemComponent.new(value: "profile")) do %>
        <%= lucide_icon("user", class: "mr-2 h-4 w-4") %>
        <span>Profile</span>
        <%= render(UI::Command::ShortcutComponent.new) { "⌘P" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Disabled Items

```erb
<%= render(UI::Command::ItemComponent.new(value: "analytics", disabled: true)) do %>
  <%= lucide_icon("bar-chart", class: "mr-2 h-4 w-4") %>
  <span>Analytics</span>
  <span class="ml-auto text-xs text-muted-foreground">Coming soon</span>
<% end %>
```

### Command Dialog with Keyboard Shortcut

```erb
<%= render(UI::Command::DialogComponent.new(shortcut: "meta+j")) do %>
  <%= render(UI::Command::InputComponent.new(placeholder: "Type a command or search...")) %>
  <%= render(UI::Command::ListComponent.new) do %>
    <%= render(UI::Command::EmptyComponent.new) { "No results found." } %>
    <%= render(UI::Command::GroupComponent.new(heading: "Suggestions")) do %>
      <%= render(UI::Command::ItemComponent.new(value: "calendar")) do %>
        <%= lucide_icon("calendar", class: "mr-2 h-4 w-4") %>
        <span>Calendar</span>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Command Dialog with Ctrl+K

```erb
<%= render(UI::Command::DialogComponent.new(shortcut: "ctrl+k")) do %>
  <%= render(UI::Command::InputComponent.new(placeholder: "Search...")) %>
  <%= render(UI::Command::ListComponent.new) do %>
    <%= render(UI::Command::EmptyComponent.new) { "No results found." } %>
    <%= render(UI::Command::GroupComponent.new(heading: "Navigation")) do %>
      <%= render(UI::Command::ItemComponent.new(value: "home")) do %>
        <%= lucide_icon("home", class: "mr-2 h-4 w-4") %>
        <span>Home</span>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Arrow Down` | Move to next item |
| `Arrow Up` | Move to previous item |
| `Enter` | Select current item |
| `Home` | Move to first item |
| `End` | Move to last item |

## Error Prevention

### Wrong: Missing Component suffix

```erb
<%= render(UI::Command::Command.new) do %>
# This is Phlex syntax, ViewComponent uses CommandComponent
```

### Correct: Use Component suffix

```erb
<%= render(UI::Command::CommandComponent.new) do %>
  <!-- content -->
<% end %>
```

### Wrong: Missing parentheses for blocks

```erb
<%= render UI::Command::CommandComponent.new do %>
# Block may not be passed correctly without parentheses
```

### Correct: Use parentheses

```erb
<%= render(UI::Command::CommandComponent.new) do %>
  <!-- content -->
<% end %>
```
