# Kbd Component - Phlex

Display textual user input from keyboard, helping users understand keyboard shortcuts and interactions within applications.

## Overview

The Kbd component provides two parts:
1. **UI::Kbd::Kbd** - Single keyboard key display
2. **UI::Kbd::Group** - Groups multiple keys together with consistent spacing

## Components

### UI::Kbd::Kbd

**Path**: `app/components/ui/kbd/kbd.rb`

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Kbd::Kbd.new { "Ctrl" } %>
```

### UI::Kbd::Group

**Path**: `app/components/ui/kbd/group.rb`

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render UI::Kbd::Group.new do %>
  <%= render UI::Kbd::Kbd.new { "Ctrl" } %>
  <%= plain "+" %>
  <%= render UI::Kbd::Kbd.new { "B" } %>
<% end %>
```

## Basic Usage

### Single Key

```ruby
<%= render UI::Kbd::Kbd.new { "Ctrl" } %>
<%= render UI::Kbd::Kbd.new { "Esc" } %>
<%= render UI::Kbd::Kbd.new { "Enter" } %>
```

### Modifier Keys

Use Unicode symbols for Mac-style keys:

```ruby
<%= render UI::Kbd::Kbd.new { "⌘" } %>  <%# Command %>
<%= render UI::Kbd::Kbd.new { "⇧" } %>  <%# Shift %>
<%= render UI::Kbd::Kbd.new { "⌥" } %>  <%# Option/Alt %>
<%= render UI::Kbd::Kbd.new { "⌃" } %>  <%# Control %>
<%= render UI::Kbd::Kbd.new { "⏎" } %>  <%# Return/Enter %>
```

### Key Combinations

```ruby
<%= render UI::Kbd::Group.new do %>
  <%= render UI::Kbd::Kbd.new { "Ctrl" } %>
  <%= plain "+" %>
  <%= render UI::Kbd::Kbd.new { "B" } %>
<% end %>

<%= render UI::Kbd::Group.new do %>
  <%= render UI::Kbd::Kbd.new { "⌘" } %>
  <%= render UI::Kbd::Kbd.new { "K" } %>
<% end %>

<%= render UI::Kbd::Group.new do %>
  <%= render UI::Kbd::Kbd.new { "⇧" } %>
  <%= render UI::Kbd::Kbd.new { "⌘" } %>
  <%= render UI::Kbd::Kbd.new { "P" } %>
<% end %>
```

## Integration Patterns

### With Button

```ruby
<%= render UI::Button::Button.new(variant: :outline, size: :sm, classes: "pr-2") do %>
  Accept <%= render UI::Kbd::Kbd.new { "⏎" } %>
<% end %>

<%= render UI::Button::Button.new(variant: :outline, size: :sm) do %>
  <%= render UI::Kbd::Kbd.new { "Esc" } %>
  Cancel
<% end %>
```

### With Tooltip

```ruby
<%= render UI::Tooltip::Tooltip.new do %>
  <%= render UI::Tooltip::Trigger.new do %>
    <%= render UI::Button::Button.new(size: :sm) { "Save" } %>
  <% end %>
  <%= render UI::Tooltip::Content.new do %>
    <div class="flex items-center gap-2">
      Save Changes <%= render UI::Kbd::Kbd.new { "S" } %>
    </div>
  <% end %>
<% end %>
```

### With Input Group

```ruby
<%= render UI::InputGroup::InputGroup.new do %>
  <%= render UI::InputGroup::Input.new(placeholder: "Search...") %>
  <%= render UI::InputGroup::Addon.new(align: "inline-end") do %>
    <%= render UI::Kbd::Kbd.new { "⌘" } %>
    <%= render UI::Kbd::Kbd.new { "K" } %>
  <% end %>
<% end %>
```

### Command Palette Hint

```ruby
<div class="flex items-center justify-between">
  <span>Open command palette</span>
  <%= render UI::Kbd::Group.new do %>
    <%= render UI::Kbd::Kbd.new { "⌘" } %>
    <%= render UI::Kbd::Kbd.new { "K" } %>
  <% end %>
</div>
```

### Navigation Shortcuts

```ruby
<div class="space-y-2">
  <div class="flex items-center justify-between">
    <span>Next page</span>
    <%= render UI::Kbd::Kbd.new { "→" } %>
  </div>
  <div class="flex items-center justify-between">
    <span>Previous page</span>
    <%= render UI::Kbd::Kbd.new { "←" } %>
  </div>
  <div class="flex items-center justify-between">
    <span>Go to top</span>
    <%= render UI::Kbd::Group.new do %>
      <%= render UI::Kbd::Kbd.new { "Ctrl" } %>
      <%= plain "+" %>
      <%= render UI::Kbd::Kbd.new { "Home" } %>
    <% end %>
  </div>
</div>
```

## Common Keyboard Symbols

| Symbol | Meaning | Usage |
|--------|---------|-------|
| `⌘` | Command (Mac) | `<%= render UI::Kbd::Kbd.new { "⌘" } %>` |
| `⌃` | Control | `<%= render UI::Kbd::Kbd.new { "⌃" } %>` |
| `⌥` | Option/Alt (Mac) | `<%= render UI::Kbd::Kbd.new { "⌥" } %>` |
| `⇧` | Shift | `<%= render UI::Kbd::Kbd.new { "⇧" } %>` |
| `⏎` | Return/Enter | `<%= render UI::Kbd::Kbd.new { "⏎" } %>` |
| `⌫` | Delete/Backspace | `<%= render UI::Kbd::Kbd.new { "⌫" } %>` |
| `⎋` | Escape | `<%= render UI::Kbd::Kbd.new { "⎋" } %>` |
| `⇥` | Tab | `<%= render UI::Kbd::Kbd.new { "⇥" } %>` |
| `␣` | Space | `<%= render UI::Kbd::Kbd.new { "␣" } %>` |

## Custom Styling

### Size Variants

```ruby
<%# Small %>
<%= render UI::Kbd::Kbd.new(classes: "text-[10px] h-4 min-w-4") { "A" } %>

<%# Default %>
<%= render UI::Kbd::Kbd.new { "A" } %>

<%# Large %>
<%= render UI::Kbd::Kbd.new(classes: "text-sm h-6 min-w-6") { "A" } %>
```

### Color Variants

```ruby
<%# Accent %>
<%= render UI::Kbd::Kbd.new(classes: "bg-accent text-accent-foreground") { "Ctrl" } %>

<%# Primary %>
<%= render UI::Kbd::Kbd.new(classes: "bg-primary text-primary-foreground") { "Enter" } %>

<%# Destructive %>
<%= render UI::Kbd::Kbd.new(classes: "bg-destructive/10 text-destructive") { "Del" } %>
```

## Error Prevention

### ❌ Wrong: Missing UI::Kbd module

```ruby
<%= render UI::Kbd.new { "Ctrl" } %>
# ERROR: undefined method 'new' for module UI::Kbd
```

### ✅ Correct: Full path

```ruby
<%= render UI::Kbd::Kbd.new { "Ctrl" } %>  # Correct!
```

### ❌ Wrong: Using plain text separator in Group

```ruby
<%= render UI::Kbd::Group.new do %>
  <%= render UI::Kbd::Kbd.new { "Ctrl" } %>
  +  <%# Wrong - this won't render %>
  <%= render UI::Kbd::Kbd.new { "B" } %>
<% end %>
```

### ✅ Correct: Use plain helper for separators

```ruby
<%= render UI::Kbd::Group.new do %>
  <%= render UI::Kbd::Kbd.new { "Ctrl" } %>
  <%= plain "+" %>  # Correct!
  <%= render UI::Kbd::Kbd.new { "B" } %>
<% end %>
```

### ❌ Wrong: Nested Kbd elements

```ruby
<%= render UI::Kbd::Kbd.new do %>
  <%= render UI::Kbd::Kbd.new { "A" } %>  # Don't nest Kbd in Kbd
<% end %>
```

### ✅ Correct: Use Group for multiple keys

```ruby
<%= render UI::Kbd::Group.new do %>
  <%= render UI::Kbd::Kbd.new { "Ctrl" } %>
  <%= render UI::Kbd::Kbd.new { "A" } %>
<% end %>  # Correct!
```

## Accessibility Notes

- The `<kbd>` element is semantic HTML for keyboard input
- Screen readers will announce it as "keyboard" input
- The component is pointer-events-none by default (not interactive)
- Use clear, recognizable key names and symbols

## Reference

- **shadcn/ui**: https://ui.shadcn.com/docs/components/kbd
- **MDN kbd element**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd
