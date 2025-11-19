# Avatar - Phlex

## Component Paths

```ruby
UI::Avatar::Avatar
UI::Avatar::Image
UI::Avatar::Fallback
```

## Description

An image element with a fallback for representing users. The Avatar component automatically handles image loading states and displays fallback content (typically initials) when images fail to load or are still loading.

Based on [shadcn/ui Avatar](https://ui.shadcn.com/docs/components/avatar) and [Radix UI Avatar](https://www.radix-ui.com/primitives/docs/components/avatar).

## Basic Usage

```ruby
render UI::Avatar::Avatar.new do
  render UI::Avatar::Image.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )
  render UI::Avatar::Fallback.new { "CN" }
end
```

## Parameters

### UI::Avatar::Avatar

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```ruby
render UI::Avatar::Avatar.new(classes: "size-12") do
  # Content
end
```

### UI::Avatar::Image

**Parameters:**
- `src:` String (required) - Image source URL
- `alt:` String - Alternative text for the image (default: "")
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes

**Example:**
```ruby
render UI::Avatar::Image.new(
  src: "https://github.com/shadcn.png",
  alt: "User avatar"
)
```

### UI::Avatar::Fallback

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes

**Example:**
```ruby
render UI::Avatar::Fallback.new { "CN" }
```

## Examples

### Basic Avatar

```ruby
render UI::Avatar::Avatar.new do
  render UI::Avatar::Image.new(
    src: "https://github.com/shadcn.png",
    alt: "@shadcn"
  )
  render UI::Avatar::Fallback.new { "CN" }
end
```

### Custom Size

```ruby
# Large avatar
render UI::Avatar::Avatar.new(classes: "size-16") do
  render UI::Avatar::Image.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )
  render UI::Avatar::Fallback.new(classes: "text-lg") { "CN" }
end

# Small avatar
render UI::Avatar::Avatar.new(classes: "size-6") do
  render UI::Avatar::Image.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )
  render UI::Avatar::Fallback.new(classes: "text-xs") { "CN" }
end
```

### Colored Fallback

```ruby
render UI::Avatar::Avatar.new do
  render UI::Avatar::Image.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )
  render UI::Avatar::Fallback.new(
    classes: "bg-primary text-primary-foreground"
  ) { "AB" }
end
```

### Rounded Square Avatar

```ruby
render UI::Avatar::Avatar.new(classes: "rounded-lg") do
  render UI::Avatar::Image.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )
  render UI::Avatar::Fallback.new(classes: "rounded-lg") { "CN" }
end
```

### Avatar List (User Group)

```ruby
div(class: "flex -space-x-2") do
  [1, 2, 3, 4].each do |i|
    render UI::Avatar::Avatar.new(classes: "ring-2 ring-background") do
      render UI::Avatar::Image.new(
        src: "https://i.pravatar.cc/150?img=#{i}",
        alt: "User #{i}"
      )
      render UI::Avatar::Fallback.new { "U#{i}" }
    end
  end
end
```

### Avatar with Status Indicator

```ruby
div(class: "relative") do
  render UI::Avatar::Avatar.new do
    render UI::Avatar::Image.new(
      src: "https://github.com/shadcn.png",
      alt: "User"
    )
    render UI::Avatar::Fallback.new { "CN" }
  end

  # Status indicator
  span(
    class: "absolute bottom-0 right-0 block size-3 rounded-full bg-green-500 ring-2 ring-background"
  )
end
```

### Avatar with Icon Fallback

```ruby
render UI::Avatar::Avatar.new do
  render UI::Avatar::Image.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )
  render UI::Avatar::Fallback.new do
    # Using an SVG icon as fallback
    svg(
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      stroke_width: "2",
      class: "size-4"
    ) do
      path(
        stroke_linecap: "round",
        stroke_linejoin: "round",
        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      )
    end
  end
end
```

## Common Patterns

### Avatar in Card Header

```ruby
div(class: "rounded-lg border bg-card p-6") do
  div(class: "flex items-center gap-4") do
    render UI::Avatar::Avatar.new do
      render UI::Avatar::Image.new(
        src: "https://github.com/shadcn.png",
        alt: "User"
      )
      render UI::Avatar::Fallback.new { "CN" }
    end

    div do
      h3(class: "font-semibold") { "Chester Nelson" }
      p(class: "text-sm text-muted-foreground") { "@chesternelson" }
    end
  end
end
```

### Avatar Dropdown Trigger

```ruby
button(
  class: "flex items-center gap-2 rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2"
) do
  render UI::Avatar::Avatar.new do
    render UI::Avatar::Image.new(
      src: "https://github.com/shadcn.png",
      alt: "User"
    )
    render UI::Avatar::Fallback.new { "CN" }
  end
  span(class: "hidden md:inline") { "Chester Nelson" }
end
```

## Size Reference

| Size Class | Dimension | Use Case |
|------------|-----------|----------|
| `size-6` | 1.5rem (24px) | Very small, inline text |
| `size-8` | 2rem (32px) | Default, navigation |
| `size-10` | 2.5rem (40px) | Medium, lists |
| `size-12` | 3rem (48px) | Large, profile headers |
| `size-16` | 4rem (64px) | Extra large, user profiles |
| `size-20` | 5rem (80px) | Huge, featured content |

## Common Mistakes

### ❌ Wrong - Not including fallback

```ruby
render UI::Avatar::Avatar.new do
  render UI::Avatar::Image.new(src: "image.jpg", alt: "User")
  # Missing fallback!
end
```

**Why it's wrong:** If the image fails to load, nothing will be displayed.

### ✅ Correct - Always include fallback

```ruby
render UI::Avatar::Avatar.new do
  render UI::Avatar::Image.new(src: "image.jpg", alt: "User")
  render UI::Avatar::Fallback.new { "U" }
end
```

### ❌ Wrong - Mismatched border radius

```ruby
render UI::Avatar::Avatar.new(classes: "rounded-lg") do
  render UI::Avatar::Image.new(src: "image.jpg", alt: "User")
  render UI::Avatar::Fallback.new { "CN" } # Will be round, not rounded-lg
end
```

**Why it's wrong:** Fallback has default rounded-full class that won't match the avatar container.

### ✅ Correct - Match border radius on fallback

```ruby
render UI::Avatar::Avatar.new(classes: "rounded-lg") do
  render UI::Avatar::Image.new(src: "image.jpg", alt: "User")
  render UI::Avatar::Fallback.new(classes: "rounded-lg") { "CN" }
end
```

### ❌ Wrong - Missing alt text

```ruby
render UI::Avatar::Image.new(src: "image.jpg")
# No alt attribute
```

**Why it's wrong:** Poor accessibility for screen readers.

### ✅ Correct - Always include alt text

```ruby
render UI::Avatar::Image.new(
  src: "image.jpg",
  alt: "Chester Nelson's profile picture"
)
```

## Accessibility

**Alt Text:**
- Always provide meaningful `alt` text for images
- Describe who the avatar represents
- Example: "Chester Nelson's profile picture"

**Fallback Content:**
- Use initials or meaningful text
- Ensure sufficient color contrast (check WCAG guidelines)
- Consider using ARIA labels when appropriate

**Interactive Avatars:**
- If avatar is clickable, ensure it has proper focus states
- Use semantic HTML (button, link) when interactive
- Include keyboard navigation support

## How It Works

The Avatar component uses a Stimulus controller to handle image loading:

1. **Initial State**: Both image and fallback are rendered, image is hidden
2. **On Load**: If image loads successfully, show image and hide fallback
3. **On Error**: If image fails to load, keep image hidden and show fallback
4. **Cached Images**: If image is already cached, immediately show image and hide fallback

This ensures smooth transitions without content jumping or flashing.

## See Also

- Phlex guide: `docs/llm/phlex.md`
- ERB implementation: `docs/llm/erb/avatar.md`
- ViewComponent implementation: `docs/llm/vc/avatar.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/avatar
- Radix UI: https://www.radix-ui.com/primitives/docs/components/avatar
