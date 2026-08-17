# Button Component - Phlex

Interactive button component with multiple style variants and sizes.

## Basic Usage

```ruby
<%= render UI::Button.new { "Click me" } %>
```

## Component Path

- **Class**: `UI::Button`
- **File**: `app/components/ui/button.rb`
- **Behavior Module**: `UI::ButtonBehavior`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | String/Symbol | `"default"` | Visual style variant |
| `size` | String/Symbol | `"default"` | Size variant |
| `type` | String | `"button"` | HTML button type attribute |
| `disabled` | Boolean | `false` | Whether button is disabled |
| `as_child` | Boolean | `false` | Yield attributes to the block instead of rendering a `<button>` |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## asChild

`as_child: true` makes Button render nothing itself. It yields its attributes to
the block, so another element carries the styling. This is how a link, a
`button_to` or a form submit can look like a button without duplicating the
class list.

```erb
<%= render UI::Button.new(as_child: true) do |attrs| %>
  <%= link_to "Settings", settings_path, **attrs %>
<% end %>

<%= render UI::Button.new(variant: :destructive, as_child: true) do |attrs| %>
  <%= button_to "Delete", thing_path, method: :delete, class: attrs[:class] %>
<% end %>

<%= render UI::Button.new(as_child: true) do |attrs| %>
  <%= form.submit "Save", class: attrs[:class] %>
<% end %>
```

Two attributes are deliberately **not** handed over, because they belong to
`<button>` and not to whatever the block renders:

| Attribute | What happens instead |
|---|---|
| `type` | Omitted — the child element decides its own semantics |
| `disabled` | Becomes `aria-disabled="true"`, since an `<a>` cannot be disabled |

The disabled styling works either way: the base classes carry both
`disabled:` and `aria-disabled:` variants.

## Variants

- `default` - Primary button style (default)
- `destructive` - Destructive action (delete, remove)
- `outline` - Outlined button
- `secondary` - Secondary button
- `ghost` - Minimal ghost button
- `link` - Link-styled button

## Sizes

- `default` - Default size (h-9 px-4 py-2)
- `sm` - Small size (h-8 px-3 text-xs)
- `lg` - Large size (h-10 px-8)
- `icon` - Icon-only square (h-9 w-9)
- `icon-sm` - Small icon (h-8 w-8)
- `icon-lg` - Large icon (h-10 w-10)

## Examples

### Basic Button

```ruby
<%= render UI::Button.new { "Click me" } %>
```

### With Variant

```ruby
<%= render UI::Button.new(variant: :destructive) { "Delete" } %>
<%= render UI::Button.new(variant: :outline) { "Cancel" } %>
<%= render UI::Button.new(variant: :ghost) { "Skip" } %>
```

### With Size

```ruby
<%= render UI::Button.new(size: :sm) { "Small" } %>
<%= render UI::Button.new(size: :lg) { "Large" } %>
```

### Disabled State

```ruby
<%= render UI::Button.new(disabled: true) { "Disabled" } %>
```

### Custom Classes

```ruby
<%= render UI::Button.new(classes: "w-full") { "Full Width" } %>
```

### Submit Button

```ruby
<%= render UI::Button.new(type: "submit") { "Submit Form" } %>
```

### With Additional Attributes

```ruby
<%= render UI::Button.new(attributes: { id: "my-button", "data-action": "click->handler#submit" }) do %>
  Submit
<% end %>
```

### Icon Button

```ruby
<%= render UI::Button.new(variant: :ghost, size: :icon) do %>
  <svg><!-- icon SVG --></svg>
<% end %>
```

### Complex Content

```ruby
<%= render UI::Button.new(variant: :outline) do %>
  <svg class="mr-2 h-4 w-4"><!-- icon --></svg>
  <span>Button with Icon</span>
<% end %>
```

## Common Patterns

### Form Submit Button

```ruby
<%= render UI::Button.new(type: "submit", variant: :default) { "Save Changes" } %>
```

### Cancel Button

```ruby
<%= render UI::Button.new(variant: :outline) { "Cancel" } %>
```

### Delete Button

```ruby
<%= render UI::Button.new(variant: :destructive) { "Delete Account" } %>
```

### Loading State

```ruby
<%= render UI::Button.new(disabled: true) do %>
  <svg class="mr-2 h-4 w-4 animate-spin"><!-- spinner icon --></svg>
  Loading...
<% end %>
```

## Integration with Other Components

### Inside Alert Dialog

```ruby
<%= render UI::AlertDialog::Trigger.new do %>
  <%= render UI::Button.new { "Open Dialog" } %>
<% end %>
```

### With Stimulus Actions

```ruby
<%= render UI::Button.new(attributes: { "data-action": "click->modal#open" }) do %>
  Open Modal
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing nested Button class

```ruby
<%= render UI::Button.new { "Text" } %>
# ERROR: undefined method 'new' for module UI::Button
```

### ✅ Correct: Use full path

```ruby
<%= render UI::Button.new { "Text" } %>  # Correct!
```

### ❌ Wrong: Passing content as parameter

```ruby
<%= render UI::Button.new(content: "Text") %>  # Won't work
```

### ✅ Correct: Content via block

```ruby
<%= render UI::Button.new { "Text" } %>  # Correct!
```
