# Input OTP - ViewComponent

Accessible one-time password component with auto-advance and copy-paste functionality.

## How it works

Like shadcn's input-otp: the root renders **one real `<input>`** (`autocomplete="one-time-code"`)
laid transparently over the slots. The slots, groups and separator only draw the input's value
(they are `aria-hidden`). So:

- `<label for>` / `aria-label` / `aria-labelledby` name the one field screen readers see
- SMS and password-manager autofill fill the whole code
- The form submits a single value under `name` (not `name[0]`, `name[1]`, ...)
- Focus is not moved on page load unless `autofocus: true`

## Component Structure

The Input OTP component consists of four ViewComponents that compose together:

- **InputOtpComponent** - Root container with Stimulus controller
- **GroupComponent** - Visual grouping for slots
- **SlotComponent** - Draws one character of the input's value
- **SeparatorComponent** - Visual divider between groups (dash icon)

## Components

### UI::InputOtpComponent

Main container component.

**Path**: `UI::InputOtpComponent`

**Parameters**:
- `length:` (Integer, default: 6) - Maximum number of OTP characters
- `pattern:` (String, default: "\\d") - Regex for one valid character
- `name:` (String, optional) - Form field name; the whole code is submitted under it as one value
- `id:` (String, optional) - Id of the real input, so `<label for>` points at it
- `value:` (String, optional) - Initial value (drawn into the slots)
- `disabled:` (Boolean, default: false) - Whether the input is disabled
- `autofocus:` (Boolean, default: false) - Focus the input on page load (opt-in)
- `required:` (Boolean, default: false) - Whether the input is required
- `invalid:` (Boolean, default: false) - Sets `aria-invalid` on the input and the error style on the slots
- `inputmode:` (String, optional) - Defaults to `"numeric"` for the digits pattern, `"text"` otherwise
- `input_attributes:` (Hash) - Extra attributes for the real input
- `classes:` (String, default: "") - Additional CSS classes for the container
- `**attributes` (Hash) - Additional HTML attributes for the container (`aria-label`, `aria-labelledby`, `aria-describedby` go to the input)

### UI::InputOtpGroupComponent

Container for grouping OTP slots together visually.

**Path**: `UI::InputOtpGroupComponent`

**Parameters**:
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### UI::InputOtpSlotComponent

Draws one character of the OTP input's value (decorative, `aria-hidden`).

**Path**: `UI::InputOtpSlotComponent`

**Parameters**:
- `index:` (Integer, default: 0) - Index of the slot in the OTP sequence
- `value:` (String, default: "") - Pre-filled character; becomes part of the input's value
- `disabled:` (Boolean, default: false) - Disables the whole OTP input
- `name:`, `id:` - Accepted for compatibility and ignored (set them on the root)
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### UI::InputOtpSeparatorComponent

Visual divider between OTP input groups (renders dash icon).

**Path**: `UI::InputOtpSeparatorComponent`

**Parameters**:
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

## Usage Examples

### Basic (6 digits with separator)

```erb
<%= render UI::InputOtpComponent.new(length: 6) do %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 0) %>
    <%= render UI::InputOtpSlotComponent.new(index: 1) %>
    <%= render UI::InputOtpSlotComponent.new(index: 2) %>
  <% end %>
  <%= render UI::InputOtpSeparatorComponent.new %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 3) %>
    <%= render UI::InputOtpSlotComponent.new(index: 4) %>
    <%= render UI::InputOtpSlotComponent.new(index: 5) %>
  <% end %>
<% end %>
```

### With Pre-filled Values

```erb
<%= render UI::InputOtpComponent.new(length: 6) do %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 0, value: "1") %>
    <%= render UI::InputOtpSlotComponent.new(index: 1, value: "2") %>
    <%= render UI::InputOtpSlotComponent.new(index: 2, value: "3") %>
  <% end %>
  <%= render UI::InputOtpSeparatorComponent.new %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 3, value: "4") %>
    <%= render UI::InputOtpSlotComponent.new(index: 4, value: "5") %>
    <%= render UI::InputOtpSlotComponent.new(index: 5, value: "6") %>
  <% end %>
<% end %>
```

### Four Digits (No Separator)

```erb
<%= render UI::InputOtpComponent.new(length: 4) do %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 0) %>
    <%= render UI::InputOtpSlotComponent.new(index: 1) %>
    <%= render UI::InputOtpSlotComponent.new(index: 2) %>
    <%= render UI::InputOtpSlotComponent.new(index: 3) %>
  <% end %>
<% end %>
```

### Alphanumeric Pattern

```erb
<%= render UI::InputOtpComponent.new(length: 6, pattern: "[A-Za-z0-9]") do %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 0) %>
    <%= render UI::InputOtpSlotComponent.new(index: 1) %>
    <%= render UI::InputOtpSlotComponent.new(index: 2) %>
  <% end %>
  <%= render UI::InputOtpSeparatorComponent.new %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 3) %>
    <%= render UI::InputOtpSlotComponent.new(index: 4) %>
    <%= render UI::InputOtpSlotComponent.new(index: 5) %>
  <% end %>
<% end %>
```

### Auto-Generated (No Composition)

When no block is provided, the component auto-generates slots:

```erb
<%= render UI::InputOtpComponent.new(length: 6) %>
```

### With Label

```erb
<div class="flex flex-col gap-2">
  <%= render UI::LabelComponent.new(for: "otp") do %>Verification code<% end %>
  <%= render UI::InputOtpComponent.new(length: 6, id: "otp", name: "code", "aria-describedby": "otp-help") %>
  <p id="otp-help" class="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
</div>
```

### Disabled State

```erb
<%= render UI::InputOtpComponent.new(length: 6) do %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 0, value: "1", disabled: true) %>
    <%= render UI::InputOtpSlotComponent.new(index: 1, value: "2", disabled: true) %>
    <%= render UI::InputOtpSlotComponent.new(index: 2, value: "3", disabled: true) %>
  <% end %>
  <%= render UI::InputOtpSeparatorComponent.new %>
  <%= render UI::InputOtpGroupComponent.new do %>
    <%= render UI::InputOtpSlotComponent.new(index: 3, value: "4", disabled: true) %>
    <%= render UI::InputOtpSlotComponent.new(index: 4, value: "5", disabled: true) %>
    <%= render UI::InputOtpSlotComponent.new(index: 5, value: "6", disabled: true) %>
  <% end %>
<% end %>
```

## Features

- **Typing**: characters fill the slots left to right; the active slot shows a ring (and a caret when empty)
- **Overwrite**: ArrowLeft/ArrowRight/Home/End move between filled slots; typing replaces the character there
- **Backspace**: deletes the character before the caret (or the selected one)
- **Paste**: pastes a whole code; spaces, dashes and other non-matching characters are dropped, extra characters cut off
- **Pattern validation**: characters that don't match `pattern` (digits by default) are dropped
- **Complete event**: fires `inputotp:complete` with `{ value }` when all slots are filled
- **Forms**: one value under `name`; a form reset redraws the slots
- **Accessibility**: one labelled text field, `autocomplete="one-time-code"`, `inputmode` from the pattern, `aria-invalid` via `invalid:`

## Event Handling

Listen for the custom `inputotp:complete` event:

```erb
<div data-controller="otp-handler" data-action="inputotp:complete->otp-handler#handleComplete">
  <%= render UI::InputOtpComponent.new(length: 6) do %>
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
<%= render UI::InputOtpComponent.new %>
```

❌ **Missing index parameter**:
```erb
<%= render UI::InputOtpSlotComponent.new(value: "1") %>  # Slot needs index
```

✅ **Correct**:
```erb
<%= render UI::InputOtpSlotComponent.new(index: 0, value: "1") %>
```

❌ **Incorrect pattern syntax**:
```erb
<%= render UI::InputOtpComponent.new(pattern: "d") %>  # Missing backslash
```

✅ **Correct**:
```erb
<%= render UI::InputOtpComponent.new(pattern: "\\d") %>  # Escaped for Ruby string
```
