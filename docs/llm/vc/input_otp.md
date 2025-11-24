# Input OTP - ViewComponent

Accessible one-time password component with auto-advance and copy-paste functionality.

## Component Structure

The Input OTP component consists of four ViewComponents that compose together:

- **InputOtpComponent** - Root container with Stimulus controller
- **GroupComponent** - Visual grouping for slots
- **SlotComponent** - Individual input field for a single character
- **SeparatorComponent** - Visual divider between groups (dash icon)

## Components

### UI::InputOtp::InputOtpComponent

Main container component.

**Path**: `UI::InputOtp::InputOtpComponent`

**Parameters**:
- `length:` (Integer, default: 6) - Maximum number of OTP characters
- `pattern:` (String, default: "\\d") - Regex pattern for valid characters
- `name:` (String, optional) - Form input name
- `id:` (String, optional) - HTML id attribute
- `disabled:` (Boolean, default: false) - Whether inputs are disabled
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### UI::InputOtp::GroupComponent

Container for grouping OTP slots together visually.

**Path**: `UI::InputOtp::GroupComponent`

**Parameters**:
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### UI::InputOtp::SlotComponent

Individual OTP input slot for a single character.

**Path**: `UI::InputOtp::SlotComponent`

**Parameters**:
- `index:` (Integer, default: 0) - Index of the slot in the OTP sequence
- `value:` (String, default: "") - Character value to display in the slot
- `name:` (String, optional) - Form input name
- `id:` (String, optional) - HTML id attribute
- `disabled:` (Boolean, default: false) - Whether input is disabled
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### UI::InputOtp::SeparatorComponent

Visual divider between OTP input groups (renders dash icon).

**Path**: `UI::InputOtp::SeparatorComponent`

**Parameters**:
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

## Usage Examples

### Basic (6 digits with separator)

```erb
<%= render UI::InputOtp::InputOtpComponent.new(length: 6) do %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 0) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 1) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 2) %>
  <% end %>
  <%= render UI::InputOtp::SeparatorComponent.new %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 3) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 4) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 5) %>
  <% end %>
<% end %>
```

### With Pre-filled Values

```erb
<%= render UI::InputOtp::InputOtpComponent.new(length: 6) do %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 0, value: "1") %>
    <%= render UI::InputOtp::SlotComponent.new(index: 1, value: "2") %>
    <%= render UI::InputOtp::SlotComponent.new(index: 2, value: "3") %>
  <% end %>
  <%= render UI::InputOtp::SeparatorComponent.new %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 3, value: "4") %>
    <%= render UI::InputOtp::SlotComponent.new(index: 4, value: "5") %>
    <%= render UI::InputOtp::SlotComponent.new(index: 5, value: "6") %>
  <% end %>
<% end %>
```

### Four Digits (No Separator)

```erb
<%= render UI::InputOtp::InputOtpComponent.new(length: 4) do %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 0) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 1) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 2) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 3) %>
  <% end %>
<% end %>
```

### Alphanumeric Pattern

```erb
<%= render UI::InputOtp::InputOtpComponent.new(length: 6, pattern: "[A-Za-z0-9]") do %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 0) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 1) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 2) %>
  <% end %>
  <%= render UI::InputOtp::SeparatorComponent.new %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 3) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 4) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 5) %>
  <% end %>
<% end %>
```

### Auto-Generated (No Composition)

When no block is provided, the component auto-generates slots:

```erb
<%= render UI::InputOtp::InputOtpComponent.new(length: 6) %>
```

### With Label

```erb
<div class="flex flex-col gap-2">
  <%= render UI::Label::LabelComponent.new(content: "Verification Code", attributes: { for: "otp-input" }) %>
  <div id="otp-input">
    <%= render UI::InputOtp::InputOtpComponent.new(length: 6) do %>
      <%= render UI::InputOtp::GroupComponent.new do %>
        <%= render UI::InputOtp::SlotComponent.new(index: 0) %>
        <%= render UI::InputOtp::SlotComponent.new(index: 1) %>
        <%= render UI::InputOtp::SlotComponent.new(index: 2) %>
      <% end %>
      <%= render UI::InputOtp::SeparatorComponent.new %>
      <%= render UI::InputOtp::GroupComponent.new do %>
        <%= render UI::InputOtp::SlotComponent.new(index: 3) %>
        <%= render UI::InputOtp::SlotComponent.new(index: 4) %>
        <%= render UI::InputOtp::SlotComponent.new(index: 5) %>
      <% end %>
    <% end %>
  </div>
  <p class="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
</div>
```

### Disabled State

```erb
<%= render UI::InputOtp::InputOtpComponent.new(length: 6) do %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 0, value: "1", disabled: true) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 1, value: "2", disabled: true) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 2, value: "3", disabled: true) %>
  <% end %>
  <%= render UI::InputOtp::SeparatorComponent.new %>
  <%= render UI::InputOtp::GroupComponent.new do %>
    <%= render UI::InputOtp::SlotComponent.new(index: 3, value: "4", disabled: true) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 4, value: "5", disabled: true) %>
    <%= render UI::InputOtp::SlotComponent.new(index: 5, value: "6", disabled: true) %>
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
  <%= render UI::InputOtp::InputOtpComponent.new(length: 6) do %>
    <%# ... slots ... %>
  <% end %>
</div>
```

The event detail contains: `{ value: "123456" }`

## Common Mistakes

❌ **Wrong class name**:
```erb
<%= render UI::InputOtp.new %>  # Missing Component suffix
```

✅ **Correct**:
```erb
<%= render UI::InputOtp::InputOtpComponent.new %>
```

❌ **Missing index parameter**:
```erb
<%= render UI::InputOtp::SlotComponent.new(value: "1") %>  # Slot needs index
```

✅ **Correct**:
```erb
<%= render UI::InputOtp::SlotComponent.new(index: 0, value: "1") %>
```

❌ **Incorrect pattern syntax**:
```erb
<%= render UI::InputOtp::InputOtpComponent.new(pattern: "d") %>  # Missing backslash
```

✅ **Correct**:
```erb
<%= render UI::InputOtp::InputOtpComponent.new(pattern: "\\d") %>  # Escaped for Ruby string
```
