# Switch Component - ViewComponent

A toggle control that allows the user to switch between checked and unchecked states.

## Basic Usage

```ruby
<%= render UI::Switch::SwitchComponent.new(id: "airplane-mode") %>
```

## Component Path

- **Class**: `UI::Switch::SwitchComponent`
- **File**: `app/components/ui/switch/switch_component.rb`
- **Behavior Module**: `SwitchBehavior`
- **Stimulus Controller**: `ui--switch`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | Boolean | `false` | Whether the switch is checked |
| `disabled` | Boolean | `false` | Whether the switch is disabled |
| `class` | String | `""` | Additional CSS classes (via attributes hash) |
| `name` | String | `nil` | Name for form submission (creates hidden input) |
| `id` | String | `nil` | ID attribute |
| `value` | String | `"1"` | Value for form submission when checked |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Switch

```ruby
<%= render UI::Switch::SwitchComponent.new(id: "airplane-mode") %>
```

### With Label

```ruby
<div class="flex items-center space-x-2">
  <%= render UI::Switch::SwitchComponent.new(id: "airplane-mode") %>
  <label for="airplane-mode">Airplane Mode</label>
</div>
```

### Checked by Default

```ruby
<%= render UI::Switch::SwitchComponent.new(checked: true, id: "notifications") %>
```

### Disabled State

```ruby
<%= render UI::Switch::SwitchComponent.new(disabled: true, id: "disabled-switch") %>
```

### With Form Integration

```ruby
<%= form_with model: @user do |f| %>
  <div class="flex items-center space-x-2">
    <%= render UI::Switch::SwitchComponent.new(
      checked: @user.notifications_enabled,
      name: "user[notifications_enabled]",
      id: "user_notifications"
    ) %>
    <label for="user_notifications">Enable notifications</label>
  </div>
<% end %>
```

### Custom Styling

```ruby
<%= render UI::Switch::SwitchComponent.new(
  id: "custom",
  class: "scale-125"
) %>
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

❌ **WRONG - Using module name**:
```ruby
<%= render UI::Switch.new(...) %>  # Wrong - this is the Phlex component!
```

✅ **CORRECT - Full component class name**:
```ruby
<%= render UI::Switch::SwitchComponent.new(id: "my-switch") %>
```

❌ **WRONG - Forgetting ID when using with label**:
```ruby
<%= render UI::Switch::SwitchComponent.new %>
<label for="switch">My Switch</label>  # No connection!
```

✅ **CORRECT - Always provide ID with labels**:
```ruby
<%= render UI::Switch::SwitchComponent.new(id: "my-switch") %>
<label for="my-switch">My Switch</label>
```

## Notes

- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard support
- **Form integration**: Automatically creates hidden input when `name` is provided
- **State management**: Uses `data-state` attribute for CSS styling
- **Stimulus controller**: Handles toggle interactions and state updates
- **Class merging**: Uses `tailwind-merge` for intelligent class merging
- **Attribute merging**: Uses `deep_merge` for nested attributes like `data-*`
- **Dark mode**: Full dark mode support via Tailwind classes
- **Transitions**: Smooth transitions on state changes
