# Checkbox Component - Phlex

Checkbox input with custom styling and animated checkmark indicator.

## Basic Usage

```ruby
<%= render UI::Checkbox::Checkbox.new(name: "accept", value: "yes") %>
```

## Component Path

- **Class**: `UI::Checkbox::Checkbox`
- **File**: `app/components/ui/checkbox/checkbox.rb`
- **Behavior Module**: `UI::CheckboxBehavior`
- **Controller**: `ui--checkbox` (Stimulus controller for state management)

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | String | `nil` | Form field name |
| `id` | String | auto-generated | HTML id attribute (auto-generated if not provided) |
| `value` | String | `nil` | Checkbox value |
| `checked` | Boolean | `false` | Whether checkbox is checked |
| `disabled` | Boolean | `false` | Whether checkbox is disabled |
| `required` | Boolean | `false` | Whether checkbox is required |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Checkbox

```ruby
<%= render UI::Checkbox::Checkbox.new(name: "terms", value: "accepted") %>
```

### Checked by Default

```ruby
<%= render UI::Checkbox::Checkbox.new(
  name: "subscribe",
  value: "yes",
  checked: true
) %>
```

### With Label

```ruby
<div class="flex items-center space-x-2">
  <%= render UI::Checkbox::Checkbox.new(id: "terms", name: "terms", value: "accepted") %>
  <%= render UI::Label::Label.new(
    for: "terms",
    classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  ) { "Accept terms and conditions" } %>
</div>
```

### Disabled Checkbox

```ruby
<%= render UI::Checkbox::Checkbox.new(
  name: "option",
  value: "yes",
  disabled: true
) %>
```

### Required Checkbox

```ruby
<%= render UI::Checkbox::Checkbox.new(
  name: "consent",
  value: "yes",
  required: true
) %>
```

### With Custom Classes

```ruby
<%= render UI::Checkbox::Checkbox.new(
  name: "option",
  value: "yes",
  classes: "border-blue-500"
) %>
```

### With Additional Attributes

```ruby
<%= render UI::Checkbox::Checkbox.new(
  name: "option",
  value: "yes",
  attributes: {
    "data-action": "change->form#validate",
    "aria-label": "Accept option"
  }
) %>
```

## Common Patterns

### Form Checkbox with Label

```ruby
<div class="items-top flex space-x-2">
  <%= render UI::Checkbox::Checkbox.new(id: "terms1", name: "terms", value: "accepted") %>
  <div class="grid gap-1.5 leading-none">
    <%= render UI::Label::Label.new(
      for: "terms1",
      classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    ) { "Accept terms and conditions" } %>
    <p class="text-sm text-muted-foreground">
      You agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
</div>
```

### Checkbox Group

```ruby
<div class="space-y-2">
  <div class="flex items-center space-x-2">
    <%= render UI::Checkbox::Checkbox.new(id: "option1", name: "options[]", value: "1") %>
    <%= render UI::Label::Label.new(for: "option1") { "Option 1" } %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render UI::Checkbox::Checkbox.new(id: "option2", name: "options[]", value: "2") %>
    <%= render UI::Label::Label.new(for: "option2") { "Option 2" } %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render UI::Checkbox::Checkbox.new(id: "option3", name: "options[]", value: "3") %>
    <%= render UI::Label::Label.new(for: "option3") { "Option 3" } %>
  </div>
</div>
```

## JavaScript Controller

The checkbox uses a Stimulus controller (`ui--checkbox`) to sync the checked state with a `data-state` attribute:

- **data-state="checked"**: When checkbox is checked
- **data-state="unchecked"**: When checkbox is unchecked

This allows CSS animations to respond to state changes.

## Accessibility

- **Keyboard**: Space to toggle
- **ARIA**: `aria-checked` attribute automatically synced with checked state
- **Focus**: Visible focus ring with `focus-visible:ring-[3px]`

## Integration with Other Components

### With Label

```ruby
<div class="flex items-center space-x-2">
  <%= render UI::Checkbox::Checkbox.new(id: "checkbox-1", name: "item", value: "1") %>
  <%= render UI::Label::Label.new(for: "checkbox-1") { "Item 1" } %>
</div>
```

### In Forms

```ruby
<%= form_with model: @user do |f| %>
  <div class="flex items-center space-x-2">
    <%= render UI::Checkbox::Checkbox.new(
      id: "newsletter",
      name: "user[newsletter]",
      value: "1",
      checked: @user.newsletter?
    ) %>
    <%= render UI::Label::Label.new(for: "newsletter") { "Subscribe to newsletter" } %>
  </div>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing nested Checkbox class

```ruby
<%= render UI::Checkbox.new(name: "option") %>
# ERROR: undefined method 'new' for module UI::Checkbox
```

### ✅ Correct: Use full path

```ruby
<%= render UI::Checkbox::Checkbox.new(name: "option") %>  # Correct!
```

### ❌ Wrong: Using content block

```ruby
<%= render UI::Checkbox::Checkbox.new(name: "option") do %>
  This won't work
<% end %>
```

### ✅ Correct: No block needed

```ruby
<%= render UI::Checkbox::Checkbox.new(name: "option") %>  # Correct!
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/checkbox
- Related: Label component (`docs/llm/phlex/label.md`)
