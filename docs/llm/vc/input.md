# Input Component - ViewComponent

Text input field with consistent styling and validation states.

## Basic Usage

```erb
<%= render UI::Input::InputComponent.new(type: "text", placeholder: "Enter text...") %>
```

## Component Path

- **Class**: `UI::Input::InputComponent`
- **File**: `app/components/ui/input/input_component.rb`
- **Behavior Module**: `UI::InputBehavior`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | String | `"text"` | HTML input type (text, email, password, etc.) |
| `placeholder` | String | `nil` | Placeholder text |
| `value` | String | `nil` | Input value |
| `name` | String | `nil` | Form field name |
| `id` | String | `nil` | HTML id attribute |
| `readonly` | Boolean | `nil` | Whether input is readonly |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Text Input

```erb
<%= render UI::Input::InputComponent.new(type: "text", placeholder: "Enter your name") %>
```

### Email Input

```erb
<%= render UI::Input::InputComponent.new(
  type: "email",
  placeholder: "john@example.com",
  name: "user[email]",
  id: "user_email"
) %>
```

### Password Input

```erb
<%= render UI::Input::InputComponent.new(
  type: "password",
  placeholder: "Enter password",
  name: "user[password]"
) %>
```

### With Value

```erb
<%= render UI::Input::InputComponent.new(
  type: "text",
  value: @user.name,
  name: "user[name]"
) %>
```

### With Additional Attributes

```erb
<%= render UI::Input::InputComponent.new(
  type: "text",
  placeholder: "Username",
  required: true,
  minlength: 3,
  "data-controller": "validation"
) %>
```

## Common Patterns

### Form Field with Label

```erb
<div class="space-y-2">
  <%= render UI::Label::LabelComponent.new(for: "email") do %>
    Email
  <% end %>
  <%= render UI::Input::InputComponent.new(
    type: "email",
    id: "email",
    name: "user[email]",
    placeholder: "Enter your email"
  ) %>
</div>
```

## Error Prevention

### ❌ Wrong: Missing nested InputComponent class

```erb
<%= render UI::Input.new(type: "text") %>
# ERROR: undefined method 'new' for module UI::Input
```

### ✅ Correct: Use full path

```erb
<%= render UI::Input::InputComponent.new(type: "text") %>  # Correct!
```

### ❌ Wrong: Using content block

```erb
<%= render UI::Input::InputComponent.new(type: "text") do %>
  This won't work
<% end %>
```

### ✅ Correct: Use value parameter

```erb
<%= render UI::Input::InputComponent.new(type: "text", value: "Content") %>  # Correct!
```

## See Also

- Phlex docs: `docs/llm/phlex/input.md`
- ERB docs: `docs/llm/erb/input.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/input
