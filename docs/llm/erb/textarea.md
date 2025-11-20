# Textarea - ERB

## Partial Path
```erb
ui/textarea/textarea
```

## Basic Usage
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Type your message here.",
  rows: 4 %>
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
| `attributes` | Hash | `{}` | Additional HTML attributes (data attributes, aria attributes, etc.) |

## Examples

### Default
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Type your message here." %>
```

### Disabled
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Type your message here.",
  attributes: { disabled: true } %>
```

### With Label
```erb
<%= render "ui/label/label", for: "message" do %>
  Your message
<% end %>
<%= render "ui/textarea/textarea",
  id: "message",
  placeholder: "Type your message here." %>
```

### With Text (Description)
```erb
<%= render "ui/label/label", for: "bio" do %>
  Bio
<% end %>
<%= render "ui/textarea/textarea",
  id: "bio",
  placeholder: "Tell us a little bit about yourself" %>
<p class="text-muted-foreground text-sm">
  You can <span class="font-medium">@mention</span> other users and organizations.
</p>
```

### With Button
```erb
<div class="grid w-full gap-2">
  <%= render "ui/textarea/textarea",
    placeholder: "Type your message here." %>
  <%= render "ui/button/button" do %>
    Send message
  <% end %>
</div>
```

### With Custom Rows
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Type your message here.",
  rows: 6 %>
```

### With Form Attributes
```erb
<%= render "ui/textarea/textarea",
  name: "description",
  id: "description",
  placeholder: "Enter description",
  value: @post.description,
  attributes: {
    required: true,
    data: { controller: "autosize" }
  } %>
```

## Common Mistakes

❌ **Wrong partial path**
```erb
<%= render "ui/textarea" %>  <!-- Wrong - missing subfolder -->
```

✅ **Correct partial path**
```erb
<%= render "ui/textarea/textarea" %>  <!-- Correct -->
```

❌ **Passing HTML attributes at top level**
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Type here",
  disabled: true %>  <!-- disabled is ignored -->
```

✅ **Use attributes hash for HTML attributes**
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Type here",
  attributes: { disabled: true } %>  <!-- Correct -->
```

❌ **Using inline styles**
```erb
<%= render "ui/textarea/textarea",
  attributes: { style: "height: 200px" } %>  <!-- Wrong -->
```

✅ **Use rows parameter or classes**
```erb
<%= render "ui/textarea/textarea", rows: 8 %>  <!-- Correct -->
<%= render "ui/textarea/textarea", classes: "min-h-32" %>  <!-- Correct -->
```

## Integration Patterns

### With Rails Form Builder
```erb
<%= form_for @post do |f| %>
  <%= render "ui/label/label", for: "post_body" do %>
    Body
  <% end %>
  <%= render "ui/textarea/textarea",
    name: "post[body]",
    id: "post_body",
    value: @post.body,
    placeholder: "Write your post content..." %>
<% end %>
```

### With form_with Helper
```erb
<%= form_with model: @post do |f| %>
  <%= f.label :body, class: "block mb-2" %>
  <%= render "ui/textarea/textarea",
    name: "post[body]",
    id: "post_body",
    value: f.object.body,
    placeholder: "Write your post content..." %>
<% end %>
```

### With Stimulus Controller
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Type your message here.",
  attributes: {
    data: {
      controller: "autosize",
      action: "input->autosize#resize"
    }
  } %>
```

### With Error State
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Enter description",
  attributes: {
    aria: {
      invalid: true,
      describedby: "description-error"
    }
  } %>
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
```erb
<%= render "ui/textarea/textarea",
  placeholder: "Type here",
  classes: "min-h-32 resize-none" %>
```
