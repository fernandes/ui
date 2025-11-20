# RadioButton Component - ViewComponent

Radio button input with custom styling and animated indicator dot.

## Basic Usage

```erb
<%= render UI::RadioButton::RadioButtonComponent.new(name: "option", value: "1") %>
```

## Component Path

- **Class**: `UI::RadioButton::RadioButtonComponent`
- **File**: `app/components/ui/radio_button/radio_button_component.rb`
- **Behavior Module**: `UI::RadioButtonBehavior`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | String | `nil` | Form field name (same for all radios in a group) |
| `id` | String | auto-generated | HTML id attribute (auto-generated if not provided) |
| `value` | String | `nil` | Radio button value |
| `checked` | Boolean | `false` | Whether radio button is checked |
| `disabled` | Boolean | `false` | Whether radio button is disabled |
| `required` | Boolean | `false` | Whether radio button is required |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Radio Button

```erb
<%= render UI::RadioButton::RadioButtonComponent.new(name: "plan", value: "free") %>
```

### Checked by Default

```erb
<%= render UI::RadioButton::RadioButtonComponent.new(
  name: "plan",
  value: "pro",
  checked: true
) %>
```

### Radio Group with Labels

```erb
<div class="space-y-3">
  <div class="flex items-center space-x-2">
    <%= render UI::RadioButton::RadioButtonComponent.new(id: "r1", name: "plan", value: "free") %>
    <%= render UI::Label::LabelComponent.new(for: "r1") do %>Free Plan<% end %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render UI::RadioButton::RadioButtonComponent.new(id: "r2", name: "plan", value: "pro", checked: true) %>
    <%= render UI::Label::LabelComponent.new(for: "r2") do %>Pro Plan<% end %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render UI::RadioButton::RadioButtonComponent.new(id: "r3", name: "plan", value: "enterprise") %>
    <%= render UI::Label::LabelComponent.new(for: "r3") do %>Enterprise Plan<% end %>
  </div>
</div>
```

### Disabled Radio Button

```erb
<%= render UI::RadioButton::RadioButtonComponent.new(
  name: "option",
  value: "disabled",
  disabled: true
) %>
```

### With Additional Attributes

```erb
<%= render UI::RadioButton::RadioButtonComponent.new(
  name: "option",
  value: "yes",
  "data-action": "change->form#submit"
) %>
```

## Common Patterns

### Radio Group with Descriptions

```erb
<div class="space-y-4">
  <div class="flex items-start space-x-3">
    <%= render UI::RadioButton::RadioButtonComponent.new(id: "plan-free", name: "plan", value: "free", checked: true) %>
    <div class="grid gap-1.5 leading-none">
      <%= render UI::Label::LabelComponent.new(
        for: "plan-free",
        classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      ) do %>
        Free
      <% end %>
      <p class="text-sm text-muted-foreground">
        Free plan with basic features
      </p>
    </div>
  </div>
</div>
```

## Error Prevention

### ❌ Wrong: Missing nested RadioButtonComponent class

```erb
<%= render UI::RadioButton.new(name: "option", value: "1") %>
# ERROR: undefined method 'new' for module UI::RadioButton
```

### ✅ Correct: Use full path

```erb
<%= render UI::RadioButton::RadioButtonComponent.new(name: "option", value: "1") %>  # Correct!
```

### ❌ Wrong: Different names for group

```erb
<%= render UI::RadioButton::RadioButtonComponent.new(name: "option1", value: "1") %>
<%= render UI::RadioButton::RadioButtonComponent.new(name: "option2", value: "2") %>
# These won't be grouped together!
```

### ✅ Correct: Same name for group

```erb
<%= render UI::RadioButton::RadioButtonComponent.new(name: "option", value: "1") %>
<%= render UI::RadioButton::RadioButtonComponent.new(name: "option", value: "2") %>  # Correct!
```

## See Also

- Phlex docs: `docs/llm/phlex/radio_button.md`
- ERB docs: `docs/llm/erb/radio_button.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/radio-group
