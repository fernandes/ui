# Command Component - Phlex

Fast, composable command palette for searching and selecting items.

## Basic Usage

```ruby
<%= render UI::Command::Command.new(classes: "rounded-lg border shadow-md") do %>
  <%= render UI::Command::Input.new(placeholder: "Search...") %>
  <%= render UI::Command::List.new do %>
    <%= render UI::Command::Empty.new { "No results found." } %>
    <%= render UI::Command::Group.new(heading: "Suggestions") do %>
      <%= render UI::Command::Item.new(value: "calendar") do %>
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
| Command | `UI::Command::Command` | `app/components/ui/command/command.rb` |
| Input | `UI::Command::Input` | `app/components/ui/command/input.rb` |
| List | `UI::Command::List` | `app/components/ui/command/list.rb` |
| Empty | `UI::Command::Empty` | `app/components/ui/command/empty.rb` |
| Group | `UI::Command::Group` | `app/components/ui/command/group.rb` |
| Item | `UI::Command::Item` | `app/components/ui/command/item.rb` |
| Separator | `UI::Command::Separator` | `app/components/ui/command/separator.rb` |
| Shortcut | `UI::Command::Shortcut` | `app/components/ui/command/shortcut.rb` |
| Dialog | `UI::Command::Dialog` | `app/components/ui/command/dialog.rb` |

## Parameters

### Command

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `loop` | Boolean | `true` | Loop navigation at boundaries |
| `classes` | String | `""` | Additional CSS classes |

### Input

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | String | `"Type a command or search..."` | Input placeholder |
| `classes` | String | `""` | Additional CSS classes |

### Group

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | String | `nil` | Group heading text |
| `classes` | String | `""` | Additional CSS classes |

### Item

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | String | `nil` | Value for filtering/selection |
| `disabled` | Boolean | `false` | Whether item is disabled |
| `classes` | String | `""` | Additional CSS classes |

### Dialog

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `shortcut` | String | `"meta+j"` | Keyboard shortcut to open dialog (uses Stimulus keyboard filter syntax) |
| `classes` | String | `""` | Additional CSS classes |

## Examples

### Full Command Palette

```ruby
<%= render UI::Command::Command.new(classes: "rounded-lg border shadow-md md:min-w-[450px]") do %>
  <%= render UI::Command::Input.new(placeholder: "Type a command or search...") %>
  <%= render UI::Command::List.new do %>
    <%= render UI::Command::Empty.new { "No results found." } %>
    <%= render UI::Command::Group.new(heading: "Suggestions") do %>
      <%= render UI::Command::Item.new(value: "calendar") do %>
        <%= lucide_icon("calendar", class: "mr-2 h-4 w-4") %>
        <span>Calendar</span>
      <% end %>
      <%= render UI::Command::Item.new(value: "calculator") do %>
        <%= lucide_icon("calculator", class: "mr-2 h-4 w-4") %>
        <span>Calculator</span>
      <% end %>
    <% end %>
    <%= render UI::Command::Separator.new %>
    <%= render UI::Command::Group.new(heading: "Settings") do %>
      <%= render UI::Command::Item.new(value: "profile") do %>
        <%= lucide_icon("user", class: "mr-2 h-4 w-4") %>
        <span>Profile</span>
        <%= render UI::Command::Shortcut.new { "⌘P" } %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Disabled Items

```ruby
<%= render UI::Command::Item.new(value: "analytics", disabled: true) do %>
  <%= lucide_icon("bar-chart", class: "mr-2 h-4 w-4") %>
  <span>Analytics</span>
  <span class="ml-auto text-xs text-muted-foreground">Coming soon</span>
<% end %>
```

### Command Dialog with Keyboard Shortcut

The `Dialog` component wraps Command in a dialog that opens with a keyboard shortcut:

```ruby
<%= render UI::Command::Dialog.new(shortcut: "meta+j") do %>
  <%= render UI::Command::Input.new(placeholder: "Type a command or search...") %>
  <%= render UI::Command::List.new do %>
    <%= render UI::Command::Empty.new { "No results found." } %>
    <%= render UI::Command::Group.new(heading: "Suggestions") do %>
      <%= render UI::Command::Item.new(value: "calendar") do %>
        <%= lucide_icon("calendar", class: "mr-2 h-4 w-4") %>
        <span>Calendar</span>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Command Dialog with Ctrl+K

```ruby
<%= render UI::Command::Dialog.new(shortcut: "ctrl+k") do %>
  <%= render UI::Command::Input.new(placeholder: "Search...") %>
  <%= render UI::Command::List.new do %>
    <%= render UI::Command::Empty.new { "No results found." } %>
    <%= render UI::Command::Group.new(heading: "Navigation") do %>
      <%= render UI::Command::Item.new(value: "home") do %>
        <%= lucide_icon("home", class: "mr-2 h-4 w-4") %>
        <span>Home</span>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Manual Dialog Trigger

For manual control, use Dialog components directly:

```ruby
<%= render UI::Dialog::Dialog.new do %>
  <%= render UI::Dialog::Trigger.new(as_child: true) do |trigger_attrs| %>
    <%= render UI::Button::Button.new(**trigger_attrs, variant: :outline) do %>
      Search...
      <kbd class="ml-auto">⌘K</kbd>
    <% end %>
  <% end %>
  <%= render UI::Dialog::Overlay.new do %>
    <%= render UI::Dialog::Content.new(classes: "p-0 overflow-hidden") do %>
      <%= render UI::Command::Command.new do %>
        <%= render UI::Command::Input.new %>
        <%= render UI::Command::List.new do %>
          <!-- groups and items -->
        <% end %>
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

## Events

The Command emits a `command:select` event when an item is selected:

```javascript
document.addEventListener("command:select", (event) => {
  console.log(event.detail.value) // Selected item value
  console.log(event.detail.item)  // Selected item element
})
```

## Error Prevention

### Wrong: Using module directly

```ruby
<%= render UI::Command.new do %>
# ERROR: undefined method 'new' for module UI::Command
```

### Correct: Use full component path

```ruby
<%= render UI::Command::Command.new do %>
```
