# Command Component - ERB

Fast, composable command palette for searching and selecting items.

## Basic Usage

```erb
<%= render "ui/command/command", classes: "rounded-lg border shadow-md" do %>
  <%= render "ui/command/input", placeholder: "Search..." %>
  <%= render "ui/command/list" do %>
    <%= render "ui/command/empty", content: "No results found." %>
    <%= render "ui/command/group", heading: "Suggestions" do %>
      <%= render "ui/command/item", value: "calendar" do %>
        <%= lucide_icon("calendar", class: "mr-2 h-4 w-4") %>
        <span>Calendar</span>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Partial Paths

| Component | Partial Path |
|-----------|--------------|
| Command | `ui/command/command` |
| Input | `ui/command/input` |
| List | `ui/command/list` |
| Empty | `ui/command/empty` |
| Group | `ui/command/group` |
| Item | `ui/command/item` |
| Separator | `ui/command/separator` |
| Shortcut | `ui/command/shortcut` |
| Dialog | `ui/command/dialog` |

## Parameters

### command

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `loop` | Boolean | `true` | Loop navigation at boundaries |
| `classes` | String | `""` | Additional CSS classes |

### input

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | String | `"Type a command or search..."` | Input placeholder |
| `classes` | String | `""` | Additional CSS classes |

### group

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | String | `nil` | Group heading text |
| `classes` | String | `""` | Additional CSS classes |

### item

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | String | `nil` | Value for filtering/selection |
| `disabled` | Boolean | `false` | Whether item is disabled |
| `classes` | String | `""` | Additional CSS classes |

### dialog

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `shortcut` | String | `"meta+j"` | Keyboard shortcut to open dialog (uses Stimulus keyboard filter syntax) |
| `classes` | String | `""` | Additional CSS classes |

## Examples

### Full Command Palette

```erb
<%= render "ui/command/command", classes: "rounded-lg border shadow-md md:min-w-[450px]" do %>
  <%= render "ui/command/input", placeholder: "Type a command or search..." %>
  <%= render "ui/command/list" do %>
    <%= render "ui/command/empty", content: "No results found." %>
    <%= render "ui/command/group", heading: "Suggestions" do %>
      <%= render "ui/command/item", value: "calendar" do %>
        <%= lucide_icon("calendar", class: "mr-2 h-4 w-4") %>
        <span>Calendar</span>
      <% end %>
      <%= render "ui/command/item", value: "calculator" do %>
        <%= lucide_icon("calculator", class: "mr-2 h-4 w-4") %>
        <span>Calculator</span>
      <% end %>
    <% end %>
    <%= render "ui/command/separator" %>
    <%= render "ui/command/group", heading: "Settings" do %>
      <%= render "ui/command/item", value: "profile" do %>
        <%= lucide_icon("user", class: "mr-2 h-4 w-4") %>
        <span>Profile</span>
        <%= render "ui/command/shortcut", content: "⌘P" %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Disabled Items

```erb
<%= render "ui/command/item", value: "analytics", disabled: true do %>
  <%= lucide_icon("bar-chart", class: "mr-2 h-4 w-4") %>
  <span>Analytics</span>
  <span class="ml-auto text-xs text-muted-foreground">Coming soon</span>
<% end %>
```

### Command Dialog with Keyboard Shortcut

```erb
<%= render "ui/command/dialog", shortcut: "meta+j" do %>
  <%= render "ui/command/input", placeholder: "Type a command or search..." %>
  <%= render "ui/command/list" do %>
    <%= render "ui/command/empty", content: "No results found." %>
    <%= render "ui/command/group", heading: "Suggestions" do %>
      <%= render "ui/command/item", value: "calendar" do %>
        <%= lucide_icon("calendar", class: "mr-2 h-4 w-4") %>
        <span>Calendar</span>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### Command Dialog with Ctrl+K

```erb
<%= render "ui/command/dialog", shortcut: "ctrl+k" do %>
  <%= render "ui/command/input", placeholder: "Search..." %>
  <%= render "ui/command/list" do %>
    <%= render "ui/command/empty", content: "No results found." %>
    <%= render "ui/command/group", heading: "Navigation" do %>
      <%= render "ui/command/item", value: "home" do %>
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

### Wrong: Using Phlex syntax

```erb
<%= render UI::Command::Command.new do %>
# This is Phlex syntax, not ERB partial syntax
```

### Correct: Use partial path

```erb
<%= render "ui/command/command" do %>
  <!-- content -->
<% end %>
```
