# RadioButton Component - Phlex

Radio button input with custom styling and animated indicator dot.

## Basic Usage

```ruby
<%= render UI::RadioButton::RadioButton.new(name: "option", value: "1") %>
```

## Component Path

- **Class**: `UI::RadioButton::RadioButton`
- **File**: `app/components/ui/radio_button/radio_button.rb`
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

```ruby
<%= render UI::RadioButton::RadioButton.new(name: "plan", value: "free") %>
```

### Checked by Default

```ruby
<%= render UI::RadioButton::RadioButton.new(
  name: "plan",
  value: "pro",
  checked: true
) %>
```

### Radio Group with Labels

```ruby
<div class="space-y-3">
  <div class="flex items-center space-x-2">
    <%= render UI::RadioButton::RadioButton.new(id: "r1", name: "plan", value: "free") %>
    <%= render UI::Label::Label.new(for: "r1") { "Free Plan" } %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render UI::RadioButton::RadioButton.new(id: "r2", name: "plan", value: "pro", checked: true) %>
    <%= render UI::Label::Label.new(for: "r2") { "Pro Plan" } %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render UI::RadioButton::RadioButton.new(id: "r3", name: "plan", value: "enterprise") %>
    <%= render UI::Label::Label.new(for: "r3") { "Enterprise Plan" } %>
  </div>
</div>
```

### Disabled Radio Button

```ruby
<%= render UI::RadioButton::RadioButton.new(
  name: "option",
  value: "disabled",
  disabled: true
) %>
```

### With Additional Attributes

```ruby
<%= render UI::RadioButton::RadioButton.new(
  name: "option",
  value: "yes",
  attributes: {
    "data-action": "change->form#submit",
    "aria-label": "Select option"
  }
) %>
```

## Common Patterns

### Radio Group with Descriptions

```ruby
<div class="space-y-4">
  <div class="flex items-start space-x-3">
    <%= render UI::RadioButton::RadioButton.new(id: "plan-free", name: "plan", value: "free", checked: true) %>
    <div class="grid gap-1.5 leading-none">
      <%= render UI::Label::Label.new(
        for: "plan-free",
        classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      ) { "Free" } %>
      <p class="text-sm text-muted-foreground">
        Free plan with basic features
      </p>
    </div>
  </div>
  <div class="flex items-start space-x-3">
    <%= render UI::RadioButton::RadioButton.new(id: "plan-pro", name: "plan", value: "pro") %>
    <div class="grid gap-1.5 leading-none">
      <%= render UI::Label::Label.new(for: "plan-pro") { "Pro" } %>
      <p class="text-sm text-muted-foreground">
        $9/month with advanced features
      </p>
    </div>
  </div>
</div>
```

### In Card Selection

```ruby
<div class="grid gap-3">
  <label class="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
    <%= render UI::RadioButton::RadioButton.new(name: "card", value: "visa") %>
    <div class="flex-1">
      <div class="font-medium">Visa ending in 1234</div>
      <div class="text-sm text-muted-foreground">Expires 12/24</div>
    </div>
  </label>
  <label class="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
    <%= render UI::RadioButton::RadioButton.new(name: "card", value: "mastercard", checked: true) %>
    <div class="flex-1">
      <div class="font-medium">Mastercard ending in 5678</div>
      <div class="text-sm text-muted-foreground">Expires 03/25</div>
    </div>
  </label>
</div>
```

## Accessibility

- **Keyboard**: Arrow keys to navigate between radio buttons in a group, Space to select
- **ARIA**: Automatically includes `data-slot="radio-group-item"` for proper grouping
- **Focus**: Visible focus ring with `focus-visible:ring-[3px]`
- **Grouping**: All radio buttons with the same `name` are treated as a group

## Integration with Other Components

### With Label

```ruby
<div class="flex items-center space-x-2">
  <%= render UI::RadioButton::RadioButton.new(id: "option-1", name: "option", value: "1") %>
  <%= render UI::Label::Label.new(for: "option-1") { "Option 1" } %>
</div>
```

### In Forms

```ruby
<%= form_with model: @user do |f| %>
  <div class="space-y-2">
    <div class="flex items-center space-x-2">
      <%= render UI::RadioButton::RadioButton.new(
        id: "role-user",
        name: "user[role]",
        value: "user",
        checked: @user.role == "user"
      ) %>
      <%= render UI::Label::Label.new(for: "role-user") { "User" } %>
    </div>
    <div class="flex items-center space-x-2">
      <%= render UI::RadioButton::RadioButton.new(
        id: "role-admin",
        name: "user[role]",
        value: "admin",
        checked: @user.role == "admin"
      ) %>
      <%= render UI::Label::Label.new(for: "role-admin") { "Admin" } %>
    </div>
  </div>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing nested RadioButton class

```ruby
<%= render UI::RadioButton.new(name: "option", value: "1") %>
# ERROR: undefined method 'new' for module UI::RadioButton
```

### ✅ Correct: Use full path

```ruby
<%= render UI::RadioButton::RadioButton.new(name: "option", value: "1") %>  # Correct!
```

### ❌ Wrong: Different names for group

```ruby
<%= render UI::RadioButton::RadioButton.new(name: "option1", value: "1") %>
<%= render UI::RadioButton::RadioButton.new(name: "option2", value: "2") %>
# These won't be grouped together!
```

### ✅ Correct: Same name for group

```ruby
<%= render UI::RadioButton::RadioButton.new(name: "option", value: "1") %>
<%= render UI::RadioButton::RadioButton.new(name: "option", value: "2") %>  # Correct!
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/radio-group
- Related: Label component (`docs/llm/phlex/label.md`)
