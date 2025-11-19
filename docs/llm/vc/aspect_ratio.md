# Aspect Ratio - ViewComponent

## Component Path

```ruby
UI::AspectRatio::AspectRatioComponent
```

## Description

Displays content within a desired aspect ratio. The component maintains proportional dimensions regardless of viewport size, making it perfect for images, videos, and other media that need consistent proportions.

Based on [shadcn/ui Aspect Ratio](https://ui.shadcn.com/docs/components/aspect-ratio) and [Radix UI Aspect Ratio](https://www.radix-ui.com/primitives/docs/components/aspect-ratio).

## Basic Usage

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
  <%= image_tag "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd",
                alt: "Photo by Drew Beamer",
                class: "h-full w-full rounded-lg object-cover" %>
<% end %>
```

## Parameters

### UI::AspectRatio::AspectRatioComponent

**Parameters:**
- `ratio:` Float - The desired aspect ratio (width/height)
  - Common ratios:
    - `16.0/9.0` - Widescreen (1.777...)
    - `4.0/3.0` - Standard (1.333...)
    - `1.0` - Square
    - `21.0/9.0` - Ultrawide (2.333...)
    - `9.0/16.0` - Portrait/Mobile (0.5625)
  - Default: `1.0` (square)
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
  <!-- Content with aspect ratio -->
<% end %>
```

## Examples

### Image with 16:9 Ratio

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0, classes: "bg-muted rounded-lg") do %>
  <%= image_tag "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd",
                alt: "Photo by Drew Beamer",
                class: "h-full w-full rounded-lg object-cover" %>
<% end %>
```

### Video with 16:9 Ratio

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
  <iframe
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    class="h-full w-full"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
<% end %>
```

### Square Image (1:1)

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 1.0) do %>
  <%= image_tag "avatar.jpg",
                alt: "User avatar",
                class: "h-full w-full object-cover rounded-full" %>
<% end %>
```

### Portrait Ratio (9:16)

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 9.0/16.0) do %>
  <%= image_tag "mobile-screenshot.png",
                alt: "Mobile screenshot",
                class: "h-full w-full object-contain" %>
<% end %>
```

### With Background and Placeholder

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0, classes: "bg-muted") do %>
  <div class="flex items-center justify-center h-full">
    <p class="text-muted-foreground">Loading...</p>
  </div>
<% end %>
```

### Map Embed

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3..."
    class="h-full w-full border-0"
    loading="lazy">
  </iframe>
<% end %>
```

## Common Patterns

### Responsive Image Gallery

```erb
<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
  <% [1, 2, 3, 4, 5, 6].each do |i| %>
    <%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 1.0) do %>
      <%= image_tag "gallery-#{i}.jpg",
                    alt: "Gallery image #{i}",
                    class: "h-full w-full object-cover rounded-lg" %>
    <% end %>
  <% end %>
</div>
```

### Video Player Container

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0, classes: "bg-black") do %>
  <%= video_tag "video.mp4",
                controls: true,
                class: "h-full w-full" %>
<% end %>
```

### Card with Fixed Ratio Image

```erb
<div class="rounded-lg border bg-card">
  <%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
    <%= image_tag "card-image.jpg",
                  alt: "Card image",
                  class: "h-full w-full object-cover rounded-t-lg" %>
  <% end %>

  <div class="p-4">
    <h3 class="font-semibold">Card Title</h3>
    <p class="text-sm text-muted-foreground">Card description</p>
  </div>
</div>
```

## Common Ratios Reference

| Ratio | Calculation | Use Case |
|-------|-------------|----------|
| 16:9 | `16.0/9.0` | Widescreen videos, modern displays |
| 4:3 | `4.0/3.0` | Traditional TV, older content |
| 1:1 | `1.0` | Square images, avatars, Instagram posts |
| 21:9 | `21.0/9.0` | Ultrawide displays, cinematic |
| 9:16 | `9.0/16.0` | Portrait/mobile, stories |
| 3:2 | `3.0/2.0` | Photography standard |
| 2:1 | `2.0` | Panoramic images |

## Common Mistakes

### ❌ Wrong - Forgetting to use Float division

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16/9) do %>
  <!-- This will be 1 (integer division), not 1.777... -->
<% end %>
```

**Why it's wrong:** Integer division in Ruby returns an integer, not a float. `16/9 = 1`, not `1.777...`.

### ✅ Correct - Use Float division

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
  <!-- Correct: 1.777... -->
<% end %>
```

### ❌ Wrong - Not using object-cover for images

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
  <%= image_tag "image.jpg", class: "w-full h-full" %>
  <!-- Image might be distorted -->
<% end %>
```

**Why it's wrong:** Without `object-cover` or `object-contain`, images may stretch or distort.

### ✅ Correct - Use object-cover or object-contain

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
  <%= image_tag "image.jpg", class: "w-full h-full object-cover" %>
  <!-- Image will crop to fill while maintaining aspect ratio -->
<% end %>
```

### ❌ Wrong - Setting height directly

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0, classes: "h-64") do %>
  <!-- Height class conflicts with aspect ratio -->
<% end %>
```

**Why it's wrong:** The component calculates height automatically. Setting height manually breaks the aspect ratio.

### ✅ Correct - Control width, let height be automatic

```erb
<div class="w-full max-w-md">
  <%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) do %>
    <!-- Height will be calculated automatically -->
  <% end %>
</div>
```

### ❌ Wrong - Missing parentheses in render

```erb
<%= render UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0) { %>
  <!-- Block won't be passed correctly without parentheses -->
<% } %>
```

**Why it's wrong:** ViewComponent requires parentheses around the component instantiation when using block syntax.

### ✅ Correct - Use parentheses with block

```erb
<%= render(UI::AspectRatio::AspectRatioComponent.new(ratio: 16.0/9.0)) do %>
  <!-- Correct: parentheses around component, do...end for block -->
<% end %>
```

## Accessibility

**Image Alt Text:**
- Always provide meaningful `alt` attributes for images
- Describe the content, not "image" or "photo"

**Video Accessibility:**
- Include captions/subtitles for video content
- Provide transcript links when possible

**ARIA Attributes:**
- Use appropriate ARIA labels for embedded content
- Consider `aria-label` for decorative containers

## See Also

- ViewComponent guide: `docs/llm/vc.md`
- Phlex implementation: `docs/llm/phlex/aspect_ratio.md`
- ERB implementation: `docs/llm/erb/aspect_ratio.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/aspect-ratio
- Radix UI: https://www.radix-ui.com/primitives/docs/components/aspect-ratio
