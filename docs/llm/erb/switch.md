# Switch Component - ERB

A toggle control that allows the user to switch between checked and unchecked states.

## Basic Usage

```erb
<%= render "ui/switch/switch", id: "airplane-mode" %>
```

## Component Path

- **Partial**: `app/views/ui/switch/_switch.html.erb`
- **Behavior Module**: `SwitchBehavior`
- **Stimulus Controller**: `ui--switch`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | Boolean | `false` | Whether the switch is checked |
| `disabled` | Boolean | `false` | Whether the switch is disabled |
| `classes` | String | `""` | Additional CSS classes (merged with TailwindMerge) |
| `name` | String | `nil` | Name for form submission (creates hidden input) |
| `id` | String | `nil` | ID attribute |
| `value` | String | `"1"` | Value for form submission when checked |
| `**attributes` | Hash | `{}` | Additional HTML attributes (merged with deep_merge) |

## Examples

### Basic Switch

```erb
<%= render "ui/switch/switch", id: "airplane-mode" %>
```

### With Label

```erb
<div class="flex items-center space-x-2">
  <%= render "ui/switch/switch", id: "airplane-mode" %>
  <label for="airplane-mode">Airplane Mode</label>
</div>
```

### Checked by Default

```erb
<%= render "ui/switch/switch", checked: true, id: "notifications" %>
```

### Disabled State

```erb
<%= render "ui/switch/switch", disabled: true, id: "disabled-switch" %>
```

### With Form Integration

```erb
<%= form_with model: @user do |f| %>
  <div class="flex items-center space-x-2">
    <%= render "ui/switch/switch",
      checked: @user.notifications_enabled,
      name: "user[notifications_enabled]",
      id: "user_notifications"
    %>
    <label for="user_notifications">Enable notifications</label>
  </div>
<% end %>
```

### Custom Styling

```erb
<%= render "ui/switch/switch",
  id: "custom",
  classes: "scale-125"
%>
```

## Keyboard Interactions

| Key | Action |
|-----|--------|
| **Space** | Toggles the switch |
| **Enter** | Toggles the switch |

## Data Attributes

- `data-state`: `"checked"` or `"unchecked"`
- `data-slot`: `"switch"`
- `data-controller`: `"ui--switch"`

## ARIA Attributes

- `role="switch"`
- `aria-checked`: `"true"` or `"false"`
- `aria-disabled`: `"true"` (when disabled)

## Form Integration

When the `name` parameter is provided, the component automatically creates a hidden input field for form submission:

- **Checked**: hidden input value = `value` parameter (default: `"1"`)
- **Unchecked**: hidden input value = `"0"`

This ensures the switch state is properly submitted with forms, even when unchecked.

## Common Usage Errors

❌ **WRONG - Incorrect partial path**:
```erb
<%= render "ui/switch" %>  # Missing /switch suffix
```

✅ **CORRECT - Full partial path**:
```erb
<%= render "ui/switch/switch", id: "my-switch" %>
```

❌ **WRONG - Forgetting ID when using with label**:
```erb
<%= render "ui/switch/switch" %>
<label for="switch">My Switch</label>  # No connection!
```

✅ **CORRECT - Always provide ID with labels**:
```erb
<%= render "ui/switch/switch", id: "my-switch" %>
<label for="my-switch">My Switch</label>
```

## Notes

- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard support
- **Form integration**: Automatically creates hidden input when `name` is provided
- **State management**: Uses `data-state` attribute for CSS styling
- **Stimulus controller**: Handles toggle interactions and state updates
- **Dark mode**: Full dark mode support via Tailwind classes
- **Transitions**: Smooth transitions on state changes
