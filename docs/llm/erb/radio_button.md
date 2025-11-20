# RadioButton Component - ERB

Radio button input with custom styling and animated indicator dot.

## Basic Usage

```erb
<%= render "ui/radio_button/radio_button", name: "option", value: "1" %>
```

## Component Path

- **Partial**: `app/views/ui/radio_button/_radio_button.html.erb`
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
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Radio Button

```erb
<%= render "ui/radio_button/radio_button", name: "plan", value: "free" %>
```

### Checked by Default

```erb
<%= render "ui/radio_button/radio_button",
  name: "plan",
  value: "pro",
  checked: true %>
```

### Radio Group with Labels

```erb
<div class="space-y-3">
  <div class="flex items-center space-x-2">
    <%= render "ui/radio_button/radio_button", id: "r1", name: "plan", value: "free" %>
    <%= render "ui/label/label", for: "r1" do %>Free Plan<% end %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render "ui/radio_button/radio_button", id: "r2", name: "plan", value: "pro", checked: true %>
    <%= render "ui/label/label", for: "r2" do %>Pro Plan<% end %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render "ui/radio_button/radio_button", id: "r3", name: "plan", value: "enterprise" %>
    <%= render "ui/label/label", for: "r3" do %>Enterprise Plan<% end %>
  </div>
</div>
```

### Disabled Radio Button

```erb
<%= render "ui/radio_button/radio_button",
  name: "option",
  value: "disabled",
  disabled: true %>
```

### With Additional Attributes

```erb
<%= render "ui/radio_button/radio_button",
  name: "option",
  value: "yes",
  attributes: {
    "data-action": "change->form#submit",
    "aria-label": "Select option"
  } %>
```

## Common Patterns

### Radio Group with Descriptions

```erb
<div class="space-y-4">
  <div class="flex items-start space-x-3">
    <%= render "ui/radio_button/radio_button", id: "plan-free", name: "plan", value: "free", checked: true %>
    <div class="grid gap-1.5 leading-none">
      <%= render "ui/label/label",
        for: "plan-free",
        classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" do %>
        Free
      <% end %>
      <p class="text-sm text-muted-foreground">
        Free plan with basic features
      </p>
    </div>
  </div>
  <div class="flex items-start space-x-3">
    <%= render "ui/radio_button/radio_button", id: "plan-pro", name: "plan", value: "pro" %>
    <div class="grid gap-1.5 leading-none">
      <%= render "ui/label/label", for: "plan-pro" do %>Pro<% end %>
      <p class="text-sm text-muted-foreground">
        $9/month with advanced features
      </p>
    </div>
  </div>
</div>
```

## Error Prevention

### ❌ Wrong: Missing = in ERB tag

```erb
<% render "ui/radio_button/radio_button", name: "option", value: "1" %>
```

### ✅ Correct: Use <%= to output

```erb
<%= render "ui/radio_button/radio_button", name: "option", value: "1" %>
```

### ❌ Wrong: Different names for group

```erb
<%= render "ui/radio_button/radio_button", name: "option1", value: "1" %>
<%= render "ui/radio_button/radio_button", name: "option2", value: "2" %>
# These won't be grouped together!
```

### ✅ Correct: Same name for group

```erb
<%= render "ui/radio_button/radio_button", name: "option", value: "1" %>
<%= render "ui/radio_button/radio_button", name: "option", value: "2" %>
```

## See Also

- Phlex docs: `docs/llm/phlex/radio_button.md`
- ViewComponent docs: `docs/llm/vc/radio_button.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/radio-group
