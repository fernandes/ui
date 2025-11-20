# Checkbox Component - ERB

Checkbox input with custom styling and animated checkmark indicator.

## Basic Usage

```erb
<%= render "ui/checkbox/checkbox", name: "accept", value: "yes" %>
```

## Component Path

- **Partial**: `app/views/ui/checkbox/_checkbox.html.erb`
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
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Checkbox

```erb
<%= render "ui/checkbox/checkbox", name: "terms", value: "accepted" %>
```

### Checked by Default

```erb
<%= render "ui/checkbox/checkbox",
  name: "subscribe",
  value: "yes",
  checked: true %>
```

### With Label

```erb
<div class="flex items-center space-x-2">
  <%= render "ui/checkbox/checkbox", id: "terms", name: "terms", value: "accepted" %>
  <%= render "ui/label/label",
    for: "terms",
    classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" do %>
    Accept terms and conditions
  <% end %>
</div>
```

### Disabled Checkbox

```erb
<%= render "ui/checkbox/checkbox",
  name: "option",
  value: "yes",
  disabled: true %>
```

### Required Checkbox

```erb
<%= render "ui/checkbox/checkbox",
  name: "consent",
  value: "yes",
  required: true %>
```

### With Additional Attributes

```erb
<%= render "ui/checkbox/checkbox",
  name: "option",
  value: "yes",
  attributes: {
    "data-action": "change->form#validate",
    "aria-label": "Accept option"
  } %>
```

## Common Patterns

### Form Checkbox with Label

```erb
<div class="items-top flex space-x-2">
  <%= render "ui/checkbox/checkbox", id: "terms1", name: "terms", value: "accepted" %>
  <div class="grid gap-1.5 leading-none">
    <%= render "ui/label/label",
      for: "terms1",
      classes: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" do %>
      Accept terms and conditions
    <% end %>
    <p class="text-sm text-muted-foreground">
      You agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
</div>
```

### Checkbox Group

```erb
<div class="space-y-2">
  <div class="flex items-center space-x-2">
    <%= render "ui/checkbox/checkbox", id: "option1", name: "options[]", value: "1" %>
    <%= render "ui/label/label", for: "option1" do %>Option 1<% end %>
  </div>
  <div class="flex items-center space-x-2">
    <%= render "ui/checkbox/checkbox", id: "option2", name: "options[]", value: "2" %>
    <%= render "ui/label/label", for: "option2" do %>Option 2<% end %>
  </div>
</div>
```

## Error Prevention

### ❌ Wrong: Missing = in ERB tag

```erb
<% render "ui/checkbox/checkbox", name: "option" %>
```

### ✅ Correct: Use <%= to output

```erb
<%= render "ui/checkbox/checkbox", name: "option" %>
```

### ❌ Wrong: Trying to use block content

```erb
<%= render "ui/checkbox/checkbox", name: "option" do %>
  This won't work
<% end %>
```

### ✅ Correct: No block needed

```erb
<%= render "ui/checkbox/checkbox", name: "option" %>
```

## See Also

- Phlex docs: `docs/llm/phlex/checkbox.md`
- ViewComponent docs: `docs/llm/vc/checkbox.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/checkbox
