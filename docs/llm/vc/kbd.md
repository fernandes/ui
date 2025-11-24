# Kbd Component - ViewComponent

Display textual user input from keyboard, helping users understand keyboard shortcuts and interactions within applications.

## Overview

The Kbd component provides two parts:
1. **UI::Kbd::KbdComponent** - Single keyboard key display
2. **UI::Kbd::GroupComponent** - Groups multiple keys together with consistent spacing

## Components

### UI::Kbd::KbdComponent

**Path**: `app/components/ui/kbd/kbd_component.rb`

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>
```

### UI::Kbd::GroupComponent

**Path**: `app/components/ui/kbd/group_component.rb`

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```ruby
<%= render(UI::Kbd::GroupComponent.new) do %>
  <%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>
  +
  <%= render(UI::Kbd::KbdComponent.new) { "B" } %>
<% end %>
```

## Basic Usage

### Single Key

```ruby
<%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>
<%= render(UI::Kbd::KbdComponent.new) { "Esc" } %>
<%= render(UI::Kbd::KbdComponent.new) { "Enter" } %>
```

### Modifier Keys

Use Unicode symbols for Mac-style keys:

```ruby
<%= render(UI::Kbd::KbdComponent.new) { "⌘" } %>  <%# Command %>
<%= render(UI::Kbd::KbdComponent.new) { "⇧" } %>  <%# Shift %>
<%= render(UI::Kbd::KbdComponent.new) { "⌥" } %>  <%# Option/Alt %>
<%= render(UI::Kbd::KbdComponent.new) { "⌃" } %>  <%# Control %>
<%= render(UI::Kbd::KbdComponent.new) { "⏎" } %>  <%# Return/Enter %>
```

### Key Combinations

```ruby
<%= render(UI::Kbd::GroupComponent.new) do %>
  <%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>
  +
  <%= render(UI::Kbd::KbdComponent.new) { "B" } %>
<% end %>

<%= render(UI::Kbd::GroupComponent.new) do %>
  <%= render(UI::Kbd::KbdComponent.new) { "⌘" } %>
  <%= render(UI::Kbd::KbdComponent.new) { "K" } %>
<% end %>

<%= render(UI::Kbd::GroupComponent.new) do %>
  <%= render(UI::Kbd::KbdComponent.new) { "⇧" } %>
  <%= render(UI::Kbd::KbdComponent.new) { "⌘" } %>
  <%= render(UI::Kbd::KbdComponent.new) { "P" } %>
<% end %>
```

## Integration Patterns

### With Button

```ruby
<%= render(UI::Button::ButtonComponent.new(variant: :outline, size: :sm, classes: "pr-2")) do %>
  Accept <%= render(UI::Kbd::KbdComponent.new) { "⏎" } %>
<% end %>

<%= render(UI::Button::ButtonComponent.new(variant: :outline, size: :sm)) do %>
  <%= render(UI::Kbd::KbdComponent.new) { "Esc" } %>
  Cancel
<% end %>
```

### With Tooltip

```ruby
<%= render(UI::Tooltip::TooltipComponent.new) do %>
  <%= render(UI::Tooltip::TriggerComponent.new) do %>
    <%= render(UI::Button::ButtonComponent.new(size: :sm)) { "Save" } %>
  <% end %>
  <%= render(UI::Tooltip::ContentComponent.new) do %>
    <div class="flex items-center gap-2">
      Save Changes <%= render(UI::Kbd::KbdComponent.new) { "S" } %>
    </div>
  <% end %>
<% end %>
```

### With Input Group

```ruby
<%= render(UI::InputGroup::InputGroupComponent.new) do %>
  <%= render(UI::InputGroup::InputComponent.new(placeholder: "Search...")) %>
  <%= render(UI::InputGroup::AddonComponent.new(align: "inline-end")) do %>
    <%= render(UI::Kbd::KbdComponent.new) { "⌘" } %>
    <%= render(UI::Kbd::KbdComponent.new) { "K" } %>
  <% end %>
<% end %>
```

### Command Palette Hint

```ruby
<div class="flex items-center justify-between">
  <span>Open command palette</span>
  <%= render(UI::Kbd::GroupComponent.new) do %>
    <%= render(UI::Kbd::KbdComponent.new) { "⌘" } %>
    <%= render(UI::Kbd::KbdComponent.new) { "K" } %>
  <% end %>
</div>
```

### Navigation Shortcuts

```ruby
<div class="space-y-2">
  <div class="flex items-center justify-between">
    <span>Next page</span>
    <%= render(UI::Kbd::KbdComponent.new) { "→" } %>
  </div>
  <div class="flex items-center justify-between">
    <span>Previous page</span>
    <%= render(UI::Kbd::KbdComponent.new) { "←" } %>
  </div>
  <div class="flex items-center justify-between">
    <span>Go to top</span>
    <%= render(UI::Kbd::GroupComponent.new) do %>
      <%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>
      +
      <%= render(UI::Kbd::KbdComponent.new) { "Home" } %>
    <% end %>
  </div>
</div>
```

## Common Keyboard Symbols

| Symbol | Meaning | Usage |
|--------|---------|-------|
| `⌘` | Command (Mac) | `<%= render(UI::Kbd::KbdComponent.new) { "⌘" } %>` |
| `⌃` | Control | `<%= render(UI::Kbd::KbdComponent.new) { "⌃" } %>` |
| `⌥` | Option/Alt (Mac) | `<%= render(UI::Kbd::KbdComponent.new) { "⌥" } %>` |
| `⇧` | Shift | `<%= render(UI::Kbd::KbdComponent.new) { "⇧" } %>` |
| `⏎` | Return/Enter | `<%= render(UI::Kbd::KbdComponent.new) { "⏎" } %>` |
| `⌫` | Delete/Backspace | `<%= render(UI::Kbd::KbdComponent.new) { "⌫" } %>` |
| `⎋` | Escape | `<%= render(UI::Kbd::KbdComponent.new) { "⎋" } %>` |
| `⇥` | Tab | `<%= render(UI::Kbd::KbdComponent.new) { "⇥" } %>` |
| `␣` | Space | `<%= render(UI::Kbd::KbdComponent.new) { "␣" } %>` |

## Custom Styling

### Size Variants

```ruby
<%# Small %>
<%= render(UI::Kbd::KbdComponent.new(classes: "text-[10px] h-4 min-w-4")) { "A" } %>

<%# Default %>
<%= render(UI::Kbd::KbdComponent.new) { "A" } %>

<%# Large %>
<%= render(UI::Kbd::KbdComponent.new(classes: "text-sm h-6 min-w-6")) { "A" } %>
```

### Color Variants

```ruby
<%# Accent %>
<%= render(UI::Kbd::KbdComponent.new(classes: "bg-accent text-accent-foreground")) { "Ctrl" } %>

<%# Primary %>
<%= render(UI::Kbd::KbdComponent.new(classes: "bg-primary text-primary-foreground")) { "Enter" } %>

<%# Destructive %>
<%= render(UI::Kbd::KbdComponent.new(classes: "bg-destructive/10 text-destructive")) { "Del" } %>
```

## Error Prevention

### ❌ Wrong: Missing Component suffix

```ruby
<%= render UI::Kbd::Kbd.new { "Ctrl" } %>
# ERROR: This is the Phlex component, not ViewComponent
```

### ✅ Correct: Use KbdComponent with parentheses

```ruby
<%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>  # Correct!
```

### ❌ Wrong: Missing parentheses when passing block

```ruby
<%= render UI::Kbd::KbdComponent.new { "Ctrl" } %>
# ERROR: Missing parentheses - block won't be passed correctly
```

### ✅ Correct: Use parentheses

```ruby
<%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>  # Correct!
```

### ❌ Wrong: Missing nested module

```ruby
<%= render(UI::KbdComponent.new) { "Ctrl" } %>
# ERROR: Component is inside UI::Kbd module
```

### ✅ Correct: Full path

```ruby
<%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>  # Correct!
```

### ❌ Wrong: Nested Kbd elements

```ruby
<%= render(UI::Kbd::KbdComponent.new) do %>
  <%= render(UI::Kbd::KbdComponent.new) { "A" } %>  <%# Don't nest Kbd in Kbd %>
<% end %>
```

### ✅ Correct: Use Group for multiple keys

```ruby
<%= render(UI::Kbd::GroupComponent.new) do %>
  <%= render(UI::Kbd::KbdComponent.new) { "Ctrl" } %>
  <%= render(UI::Kbd::KbdComponent.new) { "A" } %>
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
