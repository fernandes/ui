# Hover Card Component - Phlex

For sighted users to preview content available behind a link.

## Component Hierarchy

```
UI::HoverCard::HoverCard (root)
├── UI::HoverCard::Trigger (with asChild support)
└── UI::HoverCard::Content
```

## Root Container

```ruby
UI::HoverCard::HoverCard
```

### Parameters

- `classes` (String, default: "") - Additional CSS classes
- `attributes` (Hash, default: {}) - Additional HTML attributes

## Trigger Component (Supports asChild)

```ruby
UI::HoverCard::Trigger
```

### Parameters

- `as_child` (Boolean, default: false) - Enable composition pattern
- `tag` (Symbol, default: :span) - HTML tag when not using asChild
- `classes` (String, default: "") - Additional CSS classes
- `attributes` (Hash, default: {}) - Additional HTML attributes

### asChild Pattern

**When `as_child: true`**, the trigger doesn't render its own wrapper. Instead, it yields attributes to the block, allowing composition with other components.

**Why use asChild?**
- Compose with Button components
- Avoid nested invalid HTML (e.g., span inside button)
- Preserve layout structures
- Maintain semantic HTML

## Content Component

```ruby
UI::HoverCard::Content
```

### Parameters

- `align` (String, default: "center") - Horizontal alignment ("start", "center", "end")
- `side_offset` (Integer, default: 4) - Distance from trigger in pixels
- `classes` (String, default: "") - Additional CSS classes
- `attributes` (Hash, default: {}) - Additional HTML attributes

## Basic Usage

```ruby
render UI::HoverCard::HoverCard.new do
  render UI::HoverCard::Trigger.new do
    plain "@nextjs"
  end

  render UI::HoverCard::Content.new do
    div(class: "flex gap-4") do
      # Avatar
      render UI::Avatar::Avatar.new do
        render UI::Avatar::Image.new(src: "/avatars/nextjs.jpg", alt: "@nextjs")
        render UI::Avatar::Fallback.new { plain "NX" }
      end

      # Content
      div(class: "space-y-1") do
        h4(class: "text-sm font-semibold") { plain "@nextjs" }
        p(class: "text-sm") { plain "The React Framework – created and maintained by @vercel." }
        div(class: "flex items-center pt-2") do
          svg(class: "mr-2 size-4 opacity-70", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor") do |s|
            s.path(fill_rule: "evenodd", d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z", clip_rule: "evenodd")
          end
          span(class: "text-xs text-muted-foreground") { plain "Joined December 2021" }
        end
      end
    end
  end
end
```

## asChild Usage Examples

### Example 1: With Button Component

```ruby
render UI::HoverCard::HoverCard.new do
  # Trigger with asChild - compose with Button
  render UI::HoverCard::Trigger.new(as_child: true) do |trigger_attrs|
    render UI::Button::Button.new(**trigger_attrs, variant: :link) do
      plain "@nextjs"
    end
  end

  render UI::HoverCard::Content.new do
    plain "Next.js is a React framework for production."
  end
end
```

**Result:** Single `<button>` element with Button styles + hover card functionality.

### Example 2: With Custom Link

```ruby
render UI::HoverCard::HoverCard.new do
  # Trigger with asChild - custom styled link
  render UI::HoverCard::Trigger.new(as_child: true) do |trigger_attrs|
    a(**trigger_attrs, href: "https://nextjs.org", class: "font-medium underline underline-offset-4") do
      plain "@nextjs"
    end
  end

  render UI::HoverCard::Content.new(align: "start") do
    # Content...
  end
end
```

### Example 3: Without asChild (Default)

```ruby
render UI::HoverCard::HoverCard.new do
  # Default trigger - renders as span
  render UI::HoverCard::Trigger.new do
    plain "Hover me"
  end

  render UI::HoverCard::Content.new do
    plain "Simple hover card content"
  end
end
```

## Custom Positioning

```ruby
render UI::HoverCard::Content.new(align: "start", side_offset: 8) do
  # Content aligned to start with 8px offset
end
```

**Positioning Options:**
- `align`: "start", "center", "end"
- `side_offset`: Distance in pixels from trigger
- Auto-positioning: Content automatically positions above if no space below

## Delays (Controlled by JavaScript)

The hover card uses delays for smooth interactions:
- **Open delay**: 200ms (hover must persist before showing)
- **Close delay**: 300ms (allows moving mouse to content)

## Common Mistakes

❌ **WRONG** - Not using asChild with Button:
```ruby
render UI::HoverCard::Trigger.new do
  render UI::Button::Button.new { "Click" }
end
# Result: <span><button>Click</button></span> - nested elements
```

✅ **CORRECT** - Using asChild:
```ruby
render UI::HoverCard::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs) { "Click" }
end
# Result: <button>Click</button> - single element
```

❌ **WRONG** - Forgetting to accept block parameter:
```ruby
render UI::HoverCard::Trigger.new(as_child: true) do
  # attrs not captured!
  render UI::Button::Button.new { "Click" }
end
```

✅ **CORRECT** - Accept and use attrs:
```ruby
render UI::HoverCard::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs) { "Click" }
end
```

## Accessibility

- Content is for sighted users only
- Trigger maintains focus for keyboard navigation
- Content appears/disappears on mouse hover
- Not announced by screen readers

## Animation

Content uses Tailwind animations:
- Fade in/out on open/close
- Zoom effect (95-100%)
- Directional slide based on position (top/bottom)
- Smooth transitions with `data-state` attributes

## See Also

- asChild Pattern: `docs/patterns/as_child.md`
- Button Component: `docs/llm/phlex/button.md`
- Avatar Component: `docs/llm/phlex/avatar.md`
