# Checkbox Component - ViewComponent

Checkbox input with custom styling and animated checkmark indicator.

## Basic Usage

```erb
<%= render UI::Checkbox::CheckboxComponent.new(name: "accept", value: "yes") %>
```

## Component Path

- **Class**: `UI::Checkbox::CheckboxComponent`
- **File**: `app/components/ui/checkbox/checkbox_component.rb`
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

```erb
<%= render UI::Checkbox::CheckboxComponent.new(name: "terms", value: "accepted") %>
```

### Checked by Default

```erb
<%= render UI::Checkbox::CheckboxComponent.new(
  name: "subscribe",
  value: "yes",
  checked: true
) %>
```

### With Label

```erb
<div class="flex items-center space-x-2">
  <%= render UI::Checkbox::CheckboxComponent.new(id: "terms", name: "terms", value: "accepted") %>
  <%= render UI::Label::LabelComponent.new(
    for: "terms",
    classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  ) do %>
    Accept terms and conditions
  <% end %>
</div>
```

### Disabled Checkbox

```erb
<%= render UI::Checkbox::CheckboxComponent.new(
  name: "option",
  value: "yes",
  disabled: true
) %>
```

### With Additional Attributes

```erb
<%= render UI::Checkbox::CheckboxComponent.new(
  name: "option",
  value: "yes",
  "data-action": "change->form#validate"
) %>
```

## Common Patterns

### Form Checkbox with Label

```erb
<div class="items-top flex space-x-2">
  <%= render UI::Checkbox::CheckboxComponent.new(id: "terms1", name: "terms", value: "accepted") %>
  <div class="grid gap-1.5 leading-none">
    <%= render UI::Label::LabelComponent.new(
      for: "terms1",
      classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    ) do %>
      Accept terms and conditions
    <% end %>
    <p class="text-sm text-muted-foreground">
      You agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
</div>
```

## Error Prevention

### ❌ Wrong: Missing nested CheckboxComponent class

```erb
<%= render UI::Checkbox.new(name: "option") %>
# ERROR: undefined method 'new' for module UI::Checkbox
```

### ✅ Correct: Use full path

```erb
<%= render UI::Checkbox::CheckboxComponent.new(name: "option") %>  # Correct!
```

### ❌ Wrong: Using content block

```erb
<%= render UI::Checkbox::CheckboxComponent.new(name: "option") do %>
  This won't work
<% end %>
```

### ✅ Correct: No block needed

```erb
<%= render UI::Checkbox::CheckboxComponent.new(name: "option") %>  # Correct!
```

## See Also

- Phlex docs: `docs/llm/phlex/checkbox.md`
- ERB docs: `docs/llm/erb/checkbox.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/checkbox
