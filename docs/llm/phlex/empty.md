# Empty - Phlex

## Component Path

```ruby
UI::Empty::Empty              # Main container
UI::Empty::EmptyHeader         # Header wrapper
UI::Empty::EmptyMedia          # Visual media
UI::Empty::EmptyTitle          # Title heading
UI::Empty::EmptyDescription    # Description text
UI::Empty::EmptyContent        # Action area
```

## Description

Displays empty states in applications with customizable media, titles, descriptions, and actions.

## Basic Usage

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyTitle.new { "No results found" }
    render UI::Empty::EmptyDescription.new { "Try adjusting your search criteria." }
  end
end
```

## Sub-Components

### UI::Empty::Empty

Main container wrapping all empty state content.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyHeader

Wraps the empty media, title, and description with max-width constraint and centered layout.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyMedia

Displays visual content like icons or avatars.

**Parameters:**
- `variant:` String - Display variant
  - Options: `"default"`, `"icon"`
  - Default: `"default"`
  - `"default"` → transparent background (for images/avatars)
  - `"icon"` → muted background with rounded corners and constrained size
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyTitle

Displays the title of the empty state as an `<h3>` element.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyDescription

Displays the description of the empty state as a `<p>` element.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

### UI::Empty::EmptyContent

Displays action area content such as buttons, inputs, or links.

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes
- `**attributes` Hash - Any additional HTML attributes

## Examples

### Basic Empty State

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyTitle.new { "No results found" }
    render UI::Empty::EmptyDescription.new { "Try adjusting your search criteria." }
  end
end
```

### With Icon Media

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyMedia.new(variant: "icon") do
      # Lucide icon or SVG
      svg(class: "size-6") do
        path(d: "M21 12a9 9 0 1 1-6.219-8.56")
      end
    end
    render UI::Empty::EmptyTitle.new { "No items" }
    render UI::Empty::EmptyDescription.new { "Get started by creating your first item." }
  end
  render UI::Empty::EmptyContent.new do
    render UI::Button::Button.new { "Create Item" }
  end
end
```

### With Border (Outline Variant)

```ruby
render UI::Empty::Empty.new(classes: "border border-dashed") do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyTitle.new { "No projects" }
    render UI::Empty::EmptyDescription.new { "Create a new project to get started." }
  end
end
```

### With Background Gradient

```ruby
render UI::Empty::Empty.new(classes: "bg-gradient-to-b from-muted/50") do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyMedia.new(variant: "icon") do
      # Icon
    end
    render UI::Empty::EmptyTitle.new { "No messages" }
    render UI::Empty::EmptyDescription.new { "Start a conversation to see messages here." }
  end
end
```

### With Avatar

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyMedia.new do
      render UI::Avatar::Avatar.new(classes: "size-20") do |avatar|
        avatar.image(src: "/placeholder.jpg", alt: "User")
        avatar.fallback { "UN" }
      end
    end
    render UI::Empty::EmptyTitle.new { "No profile picture" }
    render UI::Empty::EmptyDescription.new { "Upload a profile picture to personalize your account." }
  end
  render UI::Empty::EmptyContent.new do
    render UI::Button::Button.new { "Upload Photo" }
  end
end
```

### With Input Group

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyMedia.new(variant: "icon") do
      # Search icon
    end
    render UI::Empty::EmptyTitle.new { "No results" }
    render UI::Empty::EmptyDescription.new { "We couldn't find what you're looking for." }
  end
  render UI::Empty::EmptyContent.new do
    render UI::Input::Input.new(placeholder: "Search again...")
  end
end
```

## Common Patterns

### Full Empty State with Action

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyMedia.new(variant: "icon") do
      svg(class: "size-6", fill: "none", stroke: "currentColor", viewbox: "0 0 24 24") do
        path(stroke_linecap: "round", stroke_linejoin: "round", stroke_width: "2",
             d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z")
      end
    end
    render UI::Empty::EmptyTitle.new { "No documents" }
    render UI::Empty::EmptyDescription.new { "You haven't created any documents yet. Start by creating a new document." }
  end
  render UI::Empty::EmptyContent.new do
    render UI::Button::Button.new { "Create Document" }
  end
end
```

### Minimal Empty State

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyTitle.new { "Nothing to see here" }
  end
end
```

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- Centered layout for easy scanning
- Text balance for improved readability

## Common Mistakes

### ❌ Wrong - Using Module Instead of Component

```ruby
render UI::Empty.new
```

**Why it's wrong:** `UI::Empty` is a module namespace, not the component class.

### ✅ Correct - Full Path to Component

```ruby
render UI::Empty::Empty.new
```

### ❌ Wrong - Forgetting EmptyHeader Wrapper

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyTitle.new { "Title" }
  render UI::Empty::EmptyDescription.new { "Description" }
end
```

**Why it's wrong:** EmptyHeader provides max-width constraint and proper spacing.

### ✅ Correct - Use EmptyHeader

```ruby
render UI::Empty::Empty.new do
  render UI::Empty::EmptyHeader.new do
    render UI::Empty::EmptyTitle.new { "Title" }
    render UI::Empty::EmptyDescription.new { "Description" }
  end
end
```

### ❌ Wrong - Using Symbol for Variant

```ruby
render UI::Empty::EmptyMedia.new(variant: :icon)
```

**Why it's wrong:** Variant parameter expects a String.

### ✅ Correct - String for Variant

```ruby
render UI::Empty::EmptyMedia.new(variant: "icon")
```

## Integration with Other Components

### With Button

```ruby
render UI::Empty::EmptyContent.new do
  render UI::Button::Button.new { "Take Action" }
end
```

### With Avatar

```ruby
render UI::Empty::EmptyMedia.new do
  render UI::Avatar::Avatar.new(classes: "size-20") do |avatar|
    avatar.image(src: "/user.jpg")
    avatar.fallback { "U" }
  end
end
```

### With Input

```ruby
render UI::Empty::EmptyContent.new do
  render UI::Input::Input.new(placeholder: "Search...")
end
```

## See Also

- shadcn/ui: https://ui.shadcn.com/docs/components/empty
- ERB docs: `docs/llm/erb/empty.md`
- ViewComponent docs: `docs/llm/vc/empty.md`
