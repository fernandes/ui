# Kbd Component - ERB

Display textual user input from keyboard, helping users understand keyboard shortcuts and interactions within applications.

## Overview

The Kbd component provides two parts:
1. **ui/kbd/kbd** - Single keyboard key display
2. **ui/kbd/group** - Groups multiple keys together with consistent spacing

## Components

### ui/kbd/kbd

**Path**: `app/views/ui/kbd/_kbd.html.erb`

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | String | `nil` | Key text (or use block) |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/kbd/kbd", content: "Ctrl" %>
```

### ui/kbd/group

**Path**: `app/views/ui/kbd/_group.html.erb`

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

**Example**:
```erb
<%= render "ui/kbd/group" do %>
  <%= render "ui/kbd/kbd", content: "Ctrl" %>
  +
  <%= render "ui/kbd/kbd", content: "B" %>
<% end %>
```

## Basic Usage

### Single Key

```erb
<%= render "ui/kbd/kbd", content: "Ctrl" %>
<%= render "ui/kbd/kbd", content: "Esc" %>
<%= render "ui/kbd/kbd", content: "Enter" %>
```

### Modifier Keys

Use Unicode symbols for Mac-style keys:

```erb
<%= render "ui/kbd/kbd", content: "⌘" %>  <%# Command %>
<%= render "ui/kbd/kbd", content: "⇧" %>  <%# Shift %>
<%= render "ui/kbd/kbd", content: "⌥" %>  <%# Option/Alt %>
<%= render "ui/kbd/kbd", content: "⌃" %>  <%# Control %>
<%= render "ui/kbd/kbd", content: "⏎" %>  <%# Return/Enter %>
```

### Key Combinations

```erb
<%= render "ui/kbd/group" do %>
  <%= render "ui/kbd/kbd", content: "Ctrl" %>
  +
  <%= render "ui/kbd/kbd", content: "B" %>
<% end %>

<%= render "ui/kbd/group" do %>
  <%= render "ui/kbd/kbd", content: "⌘" %>
  <%= render "ui/kbd/kbd", content: "K" %>
<% end %>

<%= render "ui/kbd/group" do %>
  <%= render "ui/kbd/kbd", content: "⇧" %>
  <%= render "ui/kbd/kbd", content: "⌘" %>
  <%= render "ui/kbd/kbd", content: "P" %>
<% end %>
```

## Content: Two Ways

You can pass content as a parameter OR as a block:

```erb
<%# Approach 1: content parameter %>
<%= render "ui/kbd/kbd", content: "Ctrl" %>

<%# Approach 2: block (useful for complex content) %>
<%= render "ui/kbd/kbd" do %>
  Ctrl
<% end %>
```

## Integration Patterns

### With Button

```erb
<%= render "ui/button/button", variant: :outline, size: :sm, classes: "pr-2" do %>
  Accept <%= render "ui/kbd/kbd", content: "⏎" %>
<% end %>

<%= render "ui/button/button", variant: :outline, size: :sm do %>
  <%= render "ui/kbd/kbd", content: "Esc" %>
  Cancel
<% end %>
```

### With Tooltip

```erb
<%= render "ui/tooltip/tooltip" do %>
  <%= render "ui/tooltip/tooltip_trigger" do %>
    <%= render "ui/button/button", size: :sm, content: "Save" %>
  <% end %>
  <%= render "ui/tooltip/tooltip_content" do %>
    <div class="flex items-center gap-2">
      Save Changes <%= render "ui/kbd/kbd", content: "S" %>
    </div>
  <% end %>
<% end %>
```

### With Input Group

```erb
<%= render "ui/input_group/input_group" do %>
  <%= render "ui/input_group/input_group_input", placeholder: "Search..." %>
  <%= render "ui/input_group/input_group_addon", align: "inline-end" do %>
    <%= render "ui/kbd/kbd", content: "⌘" %>
    <%= render "ui/kbd/kbd", content: "K" %>
  <% end %>
<% end %>
```

### Command Palette Hint

```erb
<div class="flex items-center justify-between">
  <span>Open command palette</span>
  <%= render "ui/kbd/group" do %>
    <%= render "ui/kbd/kbd", content: "⌘" %>
    <%= render "ui/kbd/kbd", content: "K" %>
  <% end %>
</div>
```

### Navigation Shortcuts

```erb
<div class="space-y-2">
  <div class="flex items-center justify-between">
    <span>Next page</span>
    <%= render "ui/kbd/kbd", content: "→" %>
  </div>
  <div class="flex items-center justify-between">
    <span>Previous page</span>
    <%= render "ui/kbd/kbd", content: "←" %>
  </div>
  <div class="flex items-center justify-between">
    <span>Go to top</span>
    <%= render "ui/kbd/group" do %>
      <%= render "ui/kbd/kbd", content: "Ctrl" %>
      +
      <%= render "ui/kbd/kbd", content: "Home" %>
    <% end %>
  </div>
</div>
```

## Common Keyboard Symbols

| Symbol | Meaning | Usage |
|--------|---------|-------|
| `⌘` | Command (Mac) | `<%= render "ui/kbd/kbd", content: "⌘" %>` |
| `⌃` | Control | `<%= render "ui/kbd/kbd", content: "⌃" %>` |
| `⌥` | Option/Alt (Mac) | `<%= render "ui/kbd/kbd", content: "⌥" %>` |
| `⇧` | Shift | `<%= render "ui/kbd/kbd", content: "⇧" %>` |
| `⏎` | Return/Enter | `<%= render "ui/kbd/kbd", content: "⏎" %>` |
| `⌫` | Delete/Backspace | `<%= render "ui/kbd/kbd", content: "⌫" %>` |
| `⎋` | Escape | `<%= render "ui/kbd/kbd", content: "⎋" %>` |
| `⇥` | Tab | `<%= render "ui/kbd/kbd", content: "⇥" %>` |
| `␣` | Space | `<%= render "ui/kbd/kbd", content: "␣" %>` |

## Custom Styling

### Size Variants

```erb
<%# Small %>
<%= render "ui/kbd/kbd", classes: "text-[10px] h-4 min-w-4", content: "A" %>

<%# Default %>
<%= render "ui/kbd/kbd", content: "A" %>

<%# Large %>
<%= render "ui/kbd/kbd", classes: "text-sm h-6 min-w-6", content: "A" %>
```

### Color Variants

```erb
<%# Accent %>
<%= render "ui/kbd/kbd", classes: "bg-accent text-accent-foreground", content: "Ctrl" %>

<%# Primary %>
<%= render "ui/kbd/kbd", classes: "bg-primary text-primary-foreground", content: "Enter" %>

<%# Destructive %>
<%= render "ui/kbd/kbd", classes: "bg-destructive/10 text-destructive", content: "Del" %>
```

## Error Prevention

### ❌ Wrong: Using Phlex syntax

```erb
<%= render UI::Kbd::Kbd.new { "Ctrl" } %>
# ERROR: This is Phlex syntax, not ERB
```

### ✅ Correct: Use string path

```erb
<%= render "ui/kbd/kbd", content: "Ctrl" %>  # Correct!
```

### ❌ Wrong: Incorrect partial path

```erb
<%= render "ui/kbd", content: "Ctrl" %>
# ERROR: Missing /kbd suffix
```

### ✅ Correct: Full partial path

```erb
<%= render "ui/kbd/kbd", content: "Ctrl" %>  # Correct!
```

### ❌ Wrong: Nested Kbd elements

```erb
<%= render "ui/kbd/kbd" do %>
  <%= render "ui/kbd/kbd", content: "A" %>  <%# Don't nest Kbd in Kbd %>
<% end %>
```

### ✅ Correct: Use Group for multiple keys

```erb
<%= render "ui/kbd/group" do %>
  <%= render "ui/kbd/kbd", content: "Ctrl" %>
  <%= render "ui/kbd/kbd", content: "A" %>
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
