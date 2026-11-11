# Input OTP - Phlex

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

The Input OTP component consists of four sub-components that compose together:

- **InputOtp** - Root container with Stimulus controller
- **Group** - Visual grouping for slots
- **Slot** - Draws one character of the input's value
- **Separator** - Visual divider between groups (dash icon)

## Components

### UI::InputOtp

Main container component.

**Path**: `UI::InputOtp`

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

### UI::InputOtpGroup

Container for grouping OTP slots together visually.

**Path**: `UI::InputOtpGroup`

**Parameters**:
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### UI::InputOtpSlot

Draws one character of the OTP input's value (decorative, `aria-hidden`).

**Path**: `UI::InputOtpSlot`

**Parameters**:
- `index:` (Integer, default: 0) - Index of the slot in the OTP sequence
- `value:` (String, default: "") - Pre-filled character; becomes part of the input's value
- `disabled:` (Boolean, default: false) - Disables the whole OTP input
- `name:`, `id:` - Accepted for compatibility and ignored (set them on the root)
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### UI::InputOtpSeparator

Visual divider between OTP input groups (renders dash icon).

**Path**: `UI::InputOtpSeparator`

**Parameters**:
- `classes:` (String, default: "") - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

## Usage Examples

### Basic (6 digits with separator)

```ruby
render UI::InputOtp.new(length: 6) do
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 0)
    render UI::InputOtpSlot.new(index: 1)
    render UI::InputOtpSlot.new(index: 2)
  end
  render UI::InputOtpSeparator.new
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 3)
    render UI::InputOtpSlot.new(index: 4)
    render UI::InputOtpSlot.new(index: 5)
  end
end
```

### With Pre-filled Values

```ruby
render UI::InputOtp.new(length: 6) do
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 0, value: "1")
    render UI::InputOtpSlot.new(index: 1, value: "2")
    render UI::InputOtpSlot.new(index: 2, value: "3")
  end
  render UI::InputOtpSeparator.new
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 3, value: "4")
    render UI::InputOtpSlot.new(index: 4, value: "5")
    render UI::InputOtpSlot.new(index: 5, value: "6")
  end
end
```

### Four Digits (No Separator)

```ruby
render UI::InputOtp.new(length: 4) do
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 0)
    render UI::InputOtpSlot.new(index: 1)
    render UI::InputOtpSlot.new(index: 2)
    render UI::InputOtpSlot.new(index: 3)
  end
end
```

### Alphanumeric Pattern

```ruby
render UI::InputOtp.new(length: 6, pattern: "[A-Za-z0-9]") do
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 0)
    render UI::InputOtpSlot.new(index: 1)
    render UI::InputOtpSlot.new(index: 2)
  end
  render UI::InputOtpSeparator.new
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 3)
    render UI::InputOtpSlot.new(index: 4)
    render UI::InputOtpSlot.new(index: 5)
  end
end
```

### Auto-Generated (No Composition)

When no block is provided, the component auto-generates slots:

```ruby
render UI::InputOtp.new(length: 6)
```

### With Label

```ruby
div(class: "flex flex-col gap-2") do
  render UI::Label.new(for: "otp") { "Verification code" }
  render UI::InputOtp.new(length: 6, id: "otp", name: "code", "aria-describedby": "otp-help")
  p(id: "otp-help", class: "text-sm text-muted-foreground") { "Enter the 6-digit code sent to your email" }
end
```

### Disabled State

```ruby
render UI::InputOtp.new(length: 6) do
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 0, value: "1", disabled: true)
    render UI::InputOtpSlot.new(index: 1, value: "2", disabled: true)
    render UI::InputOtpSlot.new(index: 2, value: "3", disabled: true)
  end
  render UI::InputOtpSeparator.new
  render UI::InputOtpGroup.new do
    render UI::InputOtpSlot.new(index: 3, value: "4", disabled: true)
    render UI::InputOtpSlot.new(index: 4, value: "5", disabled: true)
    render UI::InputOtpSlot.new(index: 5, value: "6", disabled: true)
  end
end
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

```ruby
div(
  data: {
    controller: "otp-handler",
    action: "inputotp:complete->otp-handler#handleComplete"
  }
) do
  render UI::InputOtp.new(length: 6) do
    # ... slots ...
  end
end
```

The event detail contains: `{ value: "123456" }`

## Common Mistakes

❌ **Labelling a wrapper div**:
```ruby
label(for: "otp") { "Code" }
div(id: "otp") { render UI::InputOtp.new }  # the label points at a div
```

✅ **Correct** (the id goes to the real input):
```ruby
label(for: "otp") { "Code" }
render UI::InputOtp.new(id: "otp")
```

❌ **Missing index parameter**:
```ruby
render UI::InputOtpSlot.new(value: "1")  # Slot needs index
```

✅ **Correct**:
```ruby
render UI::InputOtpSlot.new(index: 0, value: "1")
```

❌ **Incorrect pattern syntax**:
```ruby
render UI::InputOtp.new(pattern: "d")  # Missing backslash
```

✅ **Correct**:
```ruby
render UI::InputOtp.new(pattern: "\\d")  # Escaped for Ruby string
```
