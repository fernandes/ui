# Input Component - ERB

Text input field with consistent styling and validation states.

## Basic Usage

```erb
<%= render "ui/input/input", type: "text", placeholder: "Enter text..." %>
```

## Component Path

- **Partial**: `app/views/ui/input/_input.html.erb`
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
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Text Input

```erb
<%= render "ui/input/input", type: "text", placeholder: "Enter your name" %>
```

### Email Input

```erb
<%= render "ui/input/input",
  type: "email",
  placeholder: "john@example.com",
  name: "user[email]",
  id: "user_email" %>
```

### Password Input

```erb
<%= render "ui/input/input",
  type: "password",
  placeholder: "Enter password",
  name: "user[password]" %>
```

### With Value

```erb
<%= render "ui/input/input",
  type: "text",
  value: @user.name,
  name: "user[name]" %>
```

### Readonly Input

```erb
<%= render "ui/input/input",
  type: "text",
  value: "Read-only value",
  readonly: true %>
```

### With Custom Classes

```erb
<%= render "ui/input/input",
  type: "text",
  placeholder: "Search...",
  classes: "w-full max-w-sm" %>
```

### With Additional Attributes

```erb
<%= render "ui/input/input",
  type: "text",
  placeholder: "Username",
  attributes: {
    required: true,
    minlength: 3,
    "data-controller": "validation",
    "aria-label": "Username"
  } %>
```

## Common Patterns

### Form Field with Label

```erb
<div class="space-y-2">
  <%= render "ui/label/label", for: "email" do %>
    Email
  <% end %>
  <%= render "ui/input/input",
    type: "email",
    id: "email",
    name: "user[email]",
    placeholder: "Enter your email" %>
</div>
```

### In Rails Form

```erb
<%= form_with model: @user do |f| %>
  <%= render "ui/input/input",
    type: "text",
    name: "user[name]",
    value: @user.name,
    placeholder: "Enter name" %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing = in ERB tag

```erb
<% render "ui/input/input", type: "text" %>
```

### ✅ Correct: Use <%= to output

```erb
<%= render "ui/input/input", type: "text" %>
```

### ❌ Wrong: Trying to use block content

```erb
<%= render "ui/input/input", type: "text" do %>
  This won't work
<% end %>
```

### ✅ Correct: Use value parameter

```erb
<%= render "ui/input/input", type: "text", value: "Content" %>
```

## See Also

- Phlex docs: `docs/llm/phlex/input.md`
- ViewComponent docs: `docs/llm/vc/input.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/input
