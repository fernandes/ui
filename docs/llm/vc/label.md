# Label Component - ViewComponent

Accessible label for form inputs following shadcn/ui design patterns.

## Component Path

```erb
<%= render UI::Label::LabelComponent.new %>
```

## Description

Renders an accessible label associated with form controls using the HTML `<label>` element with proper `for` attribute.

## Basic Usage

```erb
<%= render UI::Label::LabelComponent.new(for_id: "email") do %>
  Email address
<% end %>
<input type="email" id="email" class="...">
```

## Component Class

- **Class**: `UI::Label::LabelComponent`
- **File**: `app/components/ui/label/label_component.rb`
- **Behavior Module**: `UI::LabelBehavior`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `for_id` | String | `nil` | The ID of the form element this label is for |
| `classes` | String | `""` | Additional CSS classes to merge |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Label with Input

```erb
<%= render UI::Label::LabelComponent.new(for_id: "email") do %>
  Email address
<% end %>
<input type="email" id="email" class="...">
```

### Label with Checkbox

```erb
<div class="flex items-center space-x-2">
  <input type="checkbox" id="terms" class="...">
  <%= render UI::Label::LabelComponent.new(for_id: "terms", classes: "cursor-pointer") do %>
    Accept terms and conditions
  <% end %>
</div>
```

### Label with Radio Button

```erb
<div class="flex items-center space-x-2">
  <input type="radio" id="option1" name="options" class="...">
  <%= render UI::Label::LabelComponent.new(for_id: "option1", classes: "cursor-pointer") do %>
    Option 1
  <% end %>
</div>
```

### Label with Select Dropdown

```erb
<div class="space-y-2">
  <%= render UI::Label::LabelComponent.new(for_id: "country") do %>
    Country
  <% end %>
  <select id="country" class="...">
    <option>United States</option>
    <option>Canada</option>
    <option>Mexico</option>
  </select>
</div>
```

### Label with Textarea

```erb
<div class="space-y-2">
  <%= render UI::Label::LabelComponent.new(for_id: "bio") do %>
    Biography
  <% end %>
  <textarea id="bio" class="..." rows="4"></textarea>
</div>
```

### Label with Custom Styling

```erb
<%= render UI::Label::LabelComponent.new(
  for_id: "password",
  classes: "text-destructive font-bold"
) do %>
  Password (required)
<% end %>
```

### Label with Disabled Input

```erb
<%= render UI::Label::LabelComponent.new(
  for_id: "disabled-field",
  classes: "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
) do %>
  Disabled field
<% end %>
<input type="text" id="disabled-field" disabled class="peer ...">
```

### Label with Additional Attributes

```erb
<%= render UI::Label::LabelComponent.new(
  for_id: "username",
  title: "Enter your username",
  "data-testid": "username-label"
) do %>
  Username
<% end %>
```

### Required Field with Asterisk

```erb
<%= render UI::Label::LabelComponent.new(for_id: "email") do %>
  Email <span class="text-destructive">*</span>
<% end %>
```

### Label with Helper Text

```erb
<div class="space-y-1">
  <%= render UI::Label::LabelComponent.new(for_id: "password") do %>
    Password
  <% end %>
  <input type="password" id="password" class="...">
  <p class="text-sm text-muted-foreground">Must be at least 8 characters</p>
</div>
```

### Form Field Group

```erb
<div class="space-y-4">
  <div class="space-y-2">
    <%= render UI::Label::LabelComponent.new(for_id: "first-name") do %>
      First name
    <% end %>
    <input type="text" id="first-name" class="...">
  </div>

  <div class="space-y-2">
    <%= render UI::Label::LabelComponent.new(for_id: "last-name") do %>
      Last name
    <% end %>
    <input type="text" id="last-name" class="...">
  </div>
</div>
```

## Common Mistakes

### ❌ Wrong: Missing nested LabelComponent class

```erb
<%= render UI::Label.new(for_id: "email") do %>Email<% end %>
# ERROR: undefined method 'new' for module UI::Label
```

### ✅ Correct: Use full class name

```erb
<%= render UI::Label::LabelComponent.new(for_id: "email") do %>Email<% end %>
```

### ❌ Wrong: Missing = in ERB tag

```erb
<% render UI::Label::LabelComponent.new(for_id: "email") do %>Email<% end %>
```

### ✅ Correct: Use <%= to output

```erb
<%= render UI::Label::LabelComponent.new(for_id: "email") do %>Email<% end %>
```

### ❌ Wrong: Mismatched for_id and input id

```erb
<%= render UI::Label::LabelComponent.new(for_id: "email") do %>Email<% end %>
<input type="text" id="username">
```

### ✅ Correct: Matching IDs

```erb
<%= render UI::Label::LabelComponent.new(for_id: "email") do %>Email<% end %>
<input type="email" id="email">
```

### ❌ Wrong: Using name parameter

```erb
<%= render UI::Label::LabelComponent.new(name: "email") do %>Email<% end %>
```

### ✅ Correct: Use for_id parameter

```erb
<%= render UI::Label::LabelComponent.new(for_id: "email") do %>Email<% end %>
```

## Accessibility

- **ARIA**: Automatically associates label with form control via `for` attribute
- **Keyboard**: Clicking label focuses the associated input
- **Screen Readers**: Announces label text when input is focused

## Integration with Other Components

The Label component is typically used in combination with:

- Form inputs (text, email, password, number, etc.)
- Textareas
- Select dropdowns
- Checkboxes
- Radio buttons
- Custom form components

## See Also

- Phlex docs: `docs/llm/phlex/label.md`
- ERB docs: `docs/llm/erb/label.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/label
- Radix UI: https://www.radix-ui.com/primitives/docs/components/label
