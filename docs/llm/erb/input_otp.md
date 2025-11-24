# Input OTP - ERB

Accessible one-time password component with auto-advance and copy-paste functionality.

## Component Structure

The Input OTP component consists of four partials that compose together:

- **input_otp** - Root container with Stimulus controller
- **group** - Visual grouping for slots
- **slot** - Individual input field for a single character
- **separator** - Visual divider between groups (dash icon)

## Partials

### ui/input_otp/input_otp

Main container partial.

**Path**: `"ui/input_otp/input_otp"`

**Parameters**:
- `length:` (Integer, default: 6) - Maximum number of OTP characters
- `pattern:` (String, default: "\\d") - Regex pattern for valid characters
- `name:` (String, optional) - Form input name
- `id:` (String, optional) - HTML id attribute
- `disabled:` (Boolean, default: false) - Whether inputs are disabled
- `classes:` (String, default: "") - Additional CSS classes
- `attributes:` (Hash) - Additional HTML attributes

### ui/input_otp/group

Container for grouping OTP slots together visually.

**Path**: `"ui/input_otp/group"`

**Parameters**:
- `classes:` (String, default: "") - Additional CSS classes
- `attributes:` (Hash) - Additional HTML attributes

### ui/input_otp/slot

Individual OTP input slot for a single character.

**Path**: `"ui/input_otp/slot"`

**Parameters**:
- `index:` (Integer, default: 0) - Index of the slot in the OTP sequence
- `value:` (String, default: "") - Character value to display in the slot
- `name:` (String, optional) - Form input name
- `id:` (String, optional) - HTML id attribute
- `disabled:` (Boolean, default: false) - Whether input is disabled
- `classes:` (String, default: "") - Additional CSS classes
- `attributes:` (Hash) - Additional HTML attributes

### ui/input_otp/separator

Visual divider between OTP input groups (renders dash icon).

**Path**: `"ui/input_otp/separator"`

**Parameters**:
- `classes:` (String, default: "") - Additional CSS classes
- `attributes:` (Hash) - Additional HTML attributes

## Usage Examples

### Basic (6 digits with separator)

```erb
<%= render "ui/input_otp/input_otp", length: 6 do %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 0 %>
    <%= render "ui/input_otp/slot", index: 1 %>
    <%= render "ui/input_otp/slot", index: 2 %>
  <% end %>
  <%= render "ui/input_otp/separator" %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 3 %>
    <%= render "ui/input_otp/slot", index: 4 %>
    <%= render "ui/input_otp/slot", index: 5 %>
  <% end %>
<% end %>
```

### With Pre-filled Values

```erb
<%= render "ui/input_otp/input_otp", length: 6 do %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 0, value: "1" %>
    <%= render "ui/input_otp/slot", index: 1, value: "2" %>
    <%= render "ui/input_otp/slot", index: 2, value: "3" %>
  <% end %>
  <%= render "ui/input_otp/separator" %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 3, value: "4" %>
    <%= render "ui/input_otp/slot", index: 4, value: "5" %>
    <%= render "ui/input_otp/slot", index: 5, value: "6" %>
  <% end %>
<% end %>
```

### Four Digits (No Separator)

```erb
<%= render "ui/input_otp/input_otp", length: 4 do %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 0 %>
    <%= render "ui/input_otp/slot", index: 1 %>
    <%= render "ui/input_otp/slot", index: 2 %>
    <%= render "ui/input_otp/slot", index: 3 %>
  <% end %>
<% end %>
```

### Alphanumeric Pattern

```erb
<%= render "ui/input_otp/input_otp", length: 6, pattern: "[A-Za-z0-9]" do %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 0 %>
    <%= render "ui/input_otp/slot", index: 1 %>
    <%= render "ui/input_otp/slot", index: 2 %>
  <% end %>
  <%= render "ui/input_otp/separator" %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 3 %>
    <%= render "ui/input_otp/slot", index: 4 %>
    <%= render "ui/input_otp/slot", index: 5 %>
  <% end %>
<% end %>
```

### Auto-Generated (No Composition)

When no block is provided, the component auto-generates slots:

```erb
<%= render "ui/input_otp/input_otp", length: 6 %>
```

### With Label

```erb
<div class="flex flex-col gap-2">
  <%= render "ui/label/label", content: "Verification Code", attributes: { for: "otp-input" } %>
  <div id="otp-input">
    <%= render "ui/input_otp/input_otp", length: 6 do %>
      <%= render "ui/input_otp/group" do %>
        <%= render "ui/input_otp/slot", index: 0 %>
        <%= render "ui/input_otp/slot", index: 1 %>
        <%= render "ui/input_otp/slot", index: 2 %>
      <% end %>
      <%= render "ui/input_otp/separator" %>
      <%= render "ui/input_otp/group" do %>
        <%= render "ui/input_otp/slot", index: 3 %>
        <%= render "ui/input_otp/slot", index: 4 %>
        <%= render "ui/input_otp/slot", index: 5 %>
      <% end %>
    <% end %>
  </div>
  <p class="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
</div>
```

### Disabled State

```erb
<%= render "ui/input_otp/input_otp", length: 6 do %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 0, value: "1", disabled: true %>
    <%= render "ui/input_otp/slot", index: 1, value: "2", disabled: true %>
    <%= render "ui/input_otp/slot", index: 2, value: "3", disabled: true %>
  <% end %>
  <%= render "ui/input_otp/separator" %>
  <%= render "ui/input_otp/group" do %>
    <%= render "ui/input_otp/slot", index: 3, value: "4", disabled: true %>
    <%= render "ui/input_otp/slot", index: 4, value: "5", disabled: true %>
    <%= render "ui/input_otp/slot", index: 5, value: "6", disabled: true %>
  <% end %>
<% end %>
```

## Features

- **Auto-advance**: Automatically moves to next input when a character is entered
- **Keyboard navigation**: Arrow keys, Home, End for navigation
- **Backspace handling**: Clears current input and moves to previous
- **Paste support**: Pastes multi-character codes and distributes across inputs
- **Pattern validation**: Validates input against regex pattern (digits by default)
- **Complete event**: Fires `inputotp:complete` event with full value when all slots are filled
- **Accessibility**: Proper ARIA attributes, `autocomplete="one-time-code"`, `inputmode="numeric"`

## Event Handling

Listen for the custom `inputotp:complete` event:

```erb
<div data-controller="otp-handler" data-action="inputotp:complete->otp-handler#handleComplete">
  <%= render "ui/input_otp/input_otp", length: 6 do %>
    <%# ... slots ... %>
  <% end %>
</div>
```

The event detail contains: `{ value: "123456" }`

## Common Mistakes

❌ **Wrong partial path**:
```erb
<%= render "input_otp" %>  # Missing ui/ prefix
```

✅ **Correct**:
```erb
<%= render "ui/input_otp/input_otp" %>
```

❌ **Missing index parameter**:
```erb
<%= render "ui/input_otp/slot", value: "1" %>  # Slot needs index
```

✅ **Correct**:
```erb
<%= render "ui/input_otp/slot", index: 0, value: "1" %>
```

❌ **Incorrect pattern syntax**:
```erb
<%= render "ui/input_otp/input_otp", pattern: "d" %>  # Missing backslash
```

✅ **Correct**:
```erb
<%= render "ui/input_otp/input_otp", pattern: "\\d" %>  # Escaped for Ruby string
```
