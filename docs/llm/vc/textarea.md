# Textarea - ViewComponent

## Component Path
```ruby
UI::Textarea::TextareaComponent
```

## Basic Usage
```ruby
render UI::Textarea::TextareaComponent.new(
  placeholder: "Type your message here.",
  rows: 4
)
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | String | `""` | Placeholder text shown when textarea is empty |
| `value` | String | `""` | Initial value of the textarea |
| `name` | String | `nil` | Name attribute for form submission |
| `id` | String | `nil` | HTML id attribute |
| `rows` | Integer | `nil` | Number of visible text lines (height) |
| `classes` | String | `""` | Additional CSS classes to merge with base classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes (data attributes, aria attributes, etc.) |

## Examples

### Default
```ruby
render UI::Textarea::TextareaComponent.new(
  placeholder: "Type your message here."
)
```

### Disabled
```ruby
render UI::Textarea::TextareaComponent.new(
  placeholder: "Type your message here.",
  disabled: true
)
```

### With Label
```erb
<%= render UI::Label::LabelComponent.new(for: "message") do %>
  Your message
<% end %>
<%= render UI::Textarea::TextareaComponent.new(
  id: "message",
  placeholder: "Type your message here."
) %>
```

### With Text (Description)
```erb
<%= render UI::Label::LabelComponent.new(for: "bio") do %>
  Bio
<% end %>
<%= render UI::Textarea::TextareaComponent.new(
  id: "bio",
  placeholder: "Tell us a little bit about yourself"
) %>
<p class="text-muted-foreground text-sm">
  You can <span class="font-medium">@mention</span> other users and organizations.
</p>
```

### With Button
```erb
<div class="grid w-full gap-2">
  <%= render UI::Textarea::TextareaComponent.new(
    placeholder: "Type your message here."
  ) %>
  <%= render UI::Button::ButtonComponent.new do %>
    Send message
  <% end %>
</div>
```

### With Custom Rows
```ruby
render UI::Textarea::TextareaComponent.new(
  placeholder: "Type your message here.",
  rows: 6
)
```

### With Form Attributes
```ruby
render UI::Textarea::TextareaComponent.new(
  name: "description",
  id: "description",
  placeholder: "Enter description",
  value: @post.description,
  required: true,
  data: { controller: "autosize" }
)
```

## Common Mistakes

❌ **Wrong module path**
```ruby
render UI::Textarea.new  # Wrong - UI::Textarea is a module
```

✅ **Correct component path**
```ruby
render UI::Textarea::TextareaComponent.new  # Correct
```

❌ **Using inline styles**
```ruby
render UI::Textarea::TextareaComponent.new(style: "height: 200px")  # Wrong
```

✅ **Use rows parameter or classes**
```ruby
render UI::Textarea::TextareaComponent.new(rows: 8)  # Correct
render UI::Textarea::TextareaComponent.new(classes: "min-h-32")  # Correct
```

## Integration Patterns

### With Form Builder
```erb
<%= form_for @post do |f| %>
  <%= render UI::Label::LabelComponent.new(for: "post_body") do %>
    Body
  <% end %>
  <%= render UI::Textarea::TextareaComponent.new(
    name: "post[body]",
    id: "post_body",
    value: @post.body,
    placeholder: "Write your post content..."
  ) %>
<% end %>
```

### With form_with Helper
```erb
<%= form_with model: @post do |f| %>
  <%= f.label :body, class: "block mb-2" %>
  <%= render UI::Textarea::TextareaComponent.new(
    name: "post[body]",
    id: "post_body",
    value: f.object.body,
    placeholder: "Write your post content..."
  ) %>
<% end %>
```

### With Stimulus Controller
```ruby
render UI::Textarea::TextareaComponent.new(
  placeholder: "Type your message here.",
  data: {
    controller: "autosize",
    action: "input->autosize#resize"
  }
)
```

### With Error State
```erb
<%= render UI::Textarea::TextareaComponent.new(
  placeholder: "Enter description",
  aria: {
    invalid: true,
    describedby: "description-error"
  }
) %>
<p id="description-error" class="text-destructive text-sm">
  Description is required
</p>
```

## Styling

The textarea uses these base classes from shadcn/ui:
- `border-input` - Border color from theme
- `placeholder:text-muted-foreground` - Muted placeholder text
- `focus-visible:border-ring` - Focus border color
- `focus-visible:ring-ring/50` - Focus ring color with opacity
- `aria-invalid:border-destructive` - Error state border
- `dark:bg-input/30` - Dark mode background
- `min-h-16` - Minimum height (4rem)
- `field-sizing-content` - Auto-resizing based on content
- `shadow-xs` - Subtle shadow
- `focus-visible:ring-[3px]` - Focus ring width

Override with `classes` parameter:
```ruby
render UI::Textarea::TextareaComponent.new(
  placeholder: "Type here",
  classes: "min-h-32 resize-none"
)
```
