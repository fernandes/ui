# Label Component - ERB

Accessible label for form inputs following shadcn/ui design patterns.

## Component Path

```erb
<%= render "ui/label" %>
```

## Description

Renders an accessible label associated with form controls using the HTML `<label>` element with proper `for` attribute.

## Basic Usage

```erb
<%= render "ui/label", for_id: "email", content: "Email address" %>
<input type="email" id="email" class="...">
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `for_id` | String | `nil` | The ID of the form element this label is for |
| `content` | String | `nil` | Label text (alternative to block) |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Label (Using content parameter)

```erb
<%= render "ui/label", for_id: "email", content: "Email address" %>
<input type="email" id="email" class="...">
```

### Basic Label (Using block)

```erb
<%= render "ui/label", for_id: "email" do %>
  Email address
<% end %>
<input type="email" id="email" class="...">
```

### Label with Checkbox

```erb
<div class="flex items-center space-x-2">
  <input type="checkbox" id="terms" class="...">
  <%= render "ui/label", for_id: "terms", classes: "cursor-pointer", content: "Accept terms" %>
</div>
```

### Label with Textarea

```erb
<div class="space-y-2">
  <%= render "ui/label", for_id: "bio", content: "Biography" %>
  <textarea id="bio" class="..." rows="4"></textarea>
</div>
```

### Label with Select

```erb
<div class="space-y-2">
  <%= render "ui/label", for_id: "country", content: "Country" %>
  <select id="country" class="...">
    <option>United States</option>
    <option>Canada</option>
    <option>Mexico</option>
  </select>
</div>
```

### Label with Custom Classes

```erb
<%= render "ui/label", for_id: "password", classes: "text-destructive font-bold", content: "Password (required)" %>
```

### Label with Additional Attributes

```erb
<%= render "ui/label",
  for_id: "username",
  content: "Username",
  attributes: {
    title: "Enter your username",
    "data-testid": "username-label"
  }
%>
```

### Required Field with Asterisk

```erb
<%= render "ui/label", for_id: "email" do %>
  Email <span class="text-destructive">*</span>
<% end %>
```

### Label with Helper Text

```erb
<div class="space-y-1">
  <%= render "ui/label", for_id: "password", content: "Password" %>
  <input type="password" id="password" class="...">
  <p class="text-sm text-muted-foreground">Must be at least 8 characters</p>
</div>
```

### Form Field Group

```erb
<div class="space-y-4">
  <div class="space-y-2">
    <%= render "ui/label", for_id: "first-name", content: "First name" %>
    <input type="text" id="first-name" class="...">
  </div>

  <div class="space-y-2">
    <%= render "ui/label", for_id: "last-name", content: "Last name" %>
    <input type="text" id="last-name" class="...">
  </div>
</div>
```

## Common Mistakes

### ❌ Wrong: Missing = in ERB tag

```erb
<% render "ui/label", for_id: "email", content: "Email" %>
```

**Why it's wrong:** Without `=`, the rendered content won't be output to the page.

### ✅ Correct: Use <%= to output

```erb
<%= render "ui/label", for_id: "email", content: "Email" %>
```

### ❌ Wrong: Mismatched for_id and input id

```erb
<%= render "ui/label", for_id: "email", content: "Email" %>
<input type="text" id="username">
```

**Why it's wrong:** The label's `for` attribute must match the input's `id` for proper association.

### ✅ Correct: Matching IDs

```erb
<%= render "ui/label", for_id: "email", content: "Email" %>
<input type="email" id="email">
```

### ❌ Wrong: Passing both content and block

```erb
<%= render "ui/label", for_id: "email", content: "Email" do %>
  This will be ignored
<% end %>
```

**Why it's wrong:** If you pass `content` parameter, the block will be ignored. Choose one approach.

### ✅ Correct: Use either content OR block

```erb
<%= render "ui/label", for_id: "email", content: "Email" %>
<!-- OR -->
<%= render "ui/label", for_id: "email" do %>Email<% end %>
```

### ❌ Wrong: Using name parameter

```erb
<%= render "ui/label", name: "email", content: "Email" %>
```

**Why it's wrong:** The parameter is `for_id`, not `name`.

### ✅ Correct: Use for_id parameter

```erb
<%= render "ui/label", for_id: "email", content: "Email" %>
```

## Accessibility

- **ARIA**: Automatically associates label with form control via `for` attribute
- **Keyboard**: Clicking label focuses the associated input
- **Screen Readers**: Announces label text when input is focused

## See Also

- Phlex docs: `docs/llm/phlex/label.md`
- ViewComponent docs: `docs/llm/vc/label.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/label
