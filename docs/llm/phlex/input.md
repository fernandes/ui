# Input Component - Phlex

Text input field with consistent styling and validation states.

## Basic Usage

```ruby
<%= render UI::Input::Input.new(type: "text", placeholder: "Enter text...") %>
```

## Component Path

- **Class**: `UI::Input::Input`
- **File**: `app/components/ui/input/input.rb`
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

```ruby
<%= render UI::Input::Input.new(type: "text", placeholder: "Enter your name") %>
```

### Email Input

```ruby
<%= render UI::Input::Input.new(
  type: "email",
  placeholder: "john@example.com",
  name: "user[email]",
  id: "user_email"
) %>
```

### Password Input

```ruby
<%= render UI::Input::Input.new(
  type: "password",
  placeholder: "Enter password",
  name: "user[password]"
) %>
```

### With Value

```ruby
<%= render UI::Input::Input.new(
  type: "text",
  value: @user.name,
  name: "user[name]"
) %>
```

### Readonly Input

```ruby
<%= render UI::Input::Input.new(
  type: "text",
  value: "Read-only value",
  readonly: true
) %>
```

### With Custom Classes

```ruby
<%= render UI::Input::Input.new(
  type: "text",
  placeholder: "Search...",
  classes: "w-full max-w-sm"
) %>
```

### With Additional Attributes

```ruby
<%= render UI::Input::Input.new(
  type: "text",
  placeholder: "Username",
  attributes: {
    required: true,
    minlength: 3,
    "data-controller": "validation",
    "aria-label": "Username"
  }
) %>
```

### Number Input

```ruby
<%= render UI::Input::Input.new(
  type: "number",
  placeholder: "Enter age",
  attributes: { min: 0, max: 120 }
) %>
```

### Date Input

```ruby
<%= render UI::Input::Input.new(
  type: "date",
  name: "user[birthday]"
) %>
```

## Common Patterns

### Form Field with Label

```ruby
<div class="space-y-2">
  <%= render UI::Label::Label.new(for: "email") { "Email" } %>
  <%= render UI::Input::Input.new(
    type: "email",
    id: "email",
    name: "user[email]",
    placeholder: "Enter your email"
  ) %>
</div>
```

### Search Input

```ruby
<%= render UI::Input::Input.new(
  type: "search",
  placeholder: "Search...",
  classes: "pl-10"
) %>
```

### With Validation State

```ruby
<%= render UI::Input::Input.new(
  type: "email",
  placeholder: "Email",
  attributes: { "aria-invalid": "true" }
) %>
```

## Validation States

The input automatically styles based on `aria-invalid` attribute:

- **Valid** (default): Standard border and focus ring
- **Invalid** (`aria-invalid="true"`): Red border and destructive focus ring

## Integration with Other Components

### With Label

```ruby
<div class="grid w-full max-w-sm items-center gap-1.5">
  <%= render UI::Label::Label.new(for: "email") { "Email" } %>
  <%= render UI::Input::Input.new(
    type: "email",
    id: "email",
    placeholder: "Email"
  ) %>
</div>
```

### In Form

```ruby
<%= form_with model: @user do |f| %>
  <%= render UI::Input::Input.new(
    type: "text",
    name: "user[name]",
    value: @user.name,
    placeholder: "Enter name"
  ) %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing nested Input class

```ruby
<%= render UI::Input.new(type: "text") %>
# ERROR: undefined method 'new' for module UI::Input
```

### ✅ Correct: Use full path

```ruby
<%= render UI::Input::Input.new(type: "text") %>  # Correct!
```

### ❌ Wrong: Using content block

```ruby
<%= render UI::Input::Input.new(type: "text") do %>
  This won't work
<% end %>
```

### ✅ Correct: Use value parameter

```ruby
<%= render UI::Input::Input.new(type: "text", value: "Content") %>  # Correct!
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/input
- Related: Label component (`docs/llm/phlex/label.md`)
