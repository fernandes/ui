# Label Component - Phlex

Accessible label for form inputs following shadcn/ui design patterns.

## Basic Usage

```ruby
render UI::Label::Label.new(for_id: "email") { "Email address" }
```

## Component Path

- **Class**: `UI::Label::Label`
- **File**: `app/components/ui/label/label.rb`
- **Behavior Module**: `UI::LabelBehavior`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `for_id` | String | `nil` | The ID of the form element this label is for |
| `classes` | String | `""` | Additional CSS classes to merge |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Label with Input

```ruby
render UI::Label::Label.new(for_id: "email") { "Email address" }
input(type: "email", id: "email", class: "...")
```

### Label with Checkbox

```ruby
div(class: "flex items-center space-x-2") do
  input(type: "checkbox", id: "terms", class: "...")
  render UI::Label::Label.new(
    for_id: "terms",
    classes: "cursor-pointer"
  ) { "Accept terms and conditions" }
end
```

### Label with Radio Button

```ruby
div(class: "flex items-center space-x-2") do
  input(type: "radio", id: "option1", name: "options", class: "...")
  render UI::Label::Label.new(
    for_id: "option1",
    classes: "cursor-pointer"
  ) { "Option 1" }
end
```

### Label with Custom Styling

```ruby
render UI::Label::Label.new(
  for_id: "password",
  classes: "text-destructive font-bold"
) { "Password (required)" }
```

### Label with Disabled Input

```ruby
# The peer-disabled:opacity-50 utility will make the label fade when input is disabled
render UI::Label::Label.new(
  for_id: "disabled-field",
  classes: "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
) { "Disabled field" }
input(type: "text", id: "disabled-field", disabled: true, class: "peer ...")
```

### Label with Additional Attributes

```ruby
render UI::Label::Label.new(
  for_id: "username",
  title: "Enter your username",
  "data-testid": "username-label"
) { "Username" }
```

## Common Patterns

### Required Field Indicator

```ruby
render UI::Label::Label.new(for_id: "email") do
  plain "Email "
  span(class: "text-destructive") { "*" }
end
```

### Label with Helper Text

```ruby
div(class: "space-y-1") do
  render UI::Label::Label.new(for_id: "bio") { "Biography" }
  textarea(id: "bio", class: "...")
  p(class: "text-sm text-muted-foreground") { "Tell us about yourself" }
end
```

### Form Field Group

```ruby
div(class: "space-y-2") do
  render UI::Label::Label.new(for_id: "first-name") { "First name" }
  input(type: "text", id: "first-name", class: "...")
end

div(class: "space-y-2") do
  render UI::Label::Label.new(for_id: "last-name") { "Last name" }
  input(type: "text", id: "last-name", class: "...")
end
```

## Accessibility

- **ARIA**: Automatically associates label with form control via `for` attribute
- **Keyboard**: Clicking label focuses the associated input
- **Screen Readers**: Announces label text when input is focused

## Integration with Other Components

The Label component can be used with any form input element:

- Text inputs (`<input type="text">`)
- Email/password inputs (`<input type="email">`, `<input type="password">`)
- Textareas (`<textarea>`)
- Select dropdowns (`<select>`)
- Checkboxes (`<input type="checkbox">`)
- Radio buttons (`<input type="radio">`)

## Error Prevention

### ❌ Wrong: Missing nested Label class

```ruby
render UI::Label.new(for_id: "email") { "Email" }
# ERROR: undefined method 'new' for module UI::Label
```

### ✅ Correct: Use full path

```ruby
render UI::Label::Label.new(for_id: "email") { "Email" }  # Correct!
```

### ❌ Wrong: Mismatched for_id and input id

```ruby
render UI::Label::Label.new(for_id: "email") { "Email" }
input(type: "text", id: "username")  # IDs don't match!
```

### ✅ Correct: Matching IDs

```ruby
render UI::Label::Label.new(for_id: "email") { "Email" }
input(type: "email", id: "email")  # Correct!
```

### ❌ Wrong: Using name instead of for_id

```ruby
render UI::Label::Label.new(name: "email") { "Email" }
# Parameter 'name' doesn't exist - use 'for_id'
```

### ✅ Correct: Use for_id parameter

```ruby
render UI::Label::Label.new(for_id: "email") { "Email" }  # Correct!
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/label
- Radix UI: https://www.radix-ui.com/primitives/docs/components/label
