# Aspect Ratio - ERB

## Component Path

```erb
<%= render "ui/aspect_ratio/aspect_ratio" %>
```

## Description

Displays content within a desired aspect ratio. The component maintains proportional dimensions regardless of viewport size, making it perfect for images, videos, and other media that need consistent proportions.

Based on [shadcn/ui Aspect Ratio](https://ui.shadcn.com/docs/components/aspect-ratio) and [Radix UI Aspect Ratio](https://www.radix-ui.com/primitives/docs/components/aspect-ratio).

## Basic Usage

```erb
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 16.0/9.0 do %>
  <%= image_tag "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd",
                alt: "Photo by Drew Beamer",
                class: "h-full w-full rounded-lg object-cover" %>
<% end %>
```

## Parameters

### ui/aspect_ratio/aspect_ratio

**Parameters:**
- `ratio:` Float - The desired aspect ratio (width/height)
  - Common ratios:
    - `16.0/9.0` - Widescreen
    - `4.0/3.0` - Standard
    - `1.0` - Square
    - `21.0/9.0` - Ultrawide
    - `9.0/16.0` - Portrait/Mobile
  - Default: `1.0` (square)
- `classes:` String - Additional Tailwind CSS classes to merge

## Examples

### Image with 16:9 Ratio

```erb
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 16.0/9.0, classes: "bg-muted rounded-lg" do %>
  <%= image_tag "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd",
                alt: "Photo by Drew Beamer",
                class: "h-full w-full rounded-lg object-cover" %>
<% end %>
```

### Video with 16:9 Ratio

```erb
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 16.0/9.0 do %>
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
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 1.0 do %>
  <%= image_tag "avatar.jpg",
                alt: "User avatar",
                class: "h-full w-full object-cover rounded-full" %>
<% end %>
```

### Portrait Ratio (9:16)

```erb
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 9.0/16.0 do %>
  <%= image_tag "mobile-screenshot.png",
                alt: "Mobile screenshot",
                class: "h-full w-full object-contain" %>
<% end %>
```

### Responsive Image Gallery

```erb
<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
  <% (1..6).each do |i| %>
    <%= render "ui/aspect_ratio/aspect_ratio", ratio: 1.0 do %>
      <%= image_tag "gallery-#{i}.jpg",
                    alt: "Gallery image #{i}",
                    class: "h-full w-full object-cover rounded-lg" %>
    <% end %>
  <% end %>
</div>
```

### Card with Fixed Ratio Image

```erb
<div class="rounded-lg border bg-card">
  <%= render "ui/aspect_ratio/aspect_ratio", ratio: 16.0/9.0 do %>
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

## Common Mistakes

### ❌ Wrong - Using integer division

```erb
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 16/9 do %>
  <!-- Will be 1, not 1.777... -->
<% end %>
```

**Why it's wrong:** Integer division returns an integer.

### ✅ Correct - Use float division

```erb
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 16.0/9.0 do %>
  <!-- Correct: 1.777... -->
<% end %>
```

### ❌ Wrong - Not using object-cover

```erb
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 16.0/9.0 do %>
  <%= image_tag "image.jpg", class: "w-full h-full" %>
<% end %>
```

**Why it's wrong:** Image may distort without object-cover.

### ✅ Correct - Use object-cover or object-contain

```erb
<%= render "ui/aspect_ratio/aspect_ratio", ratio: 16.0/9.0 do %>
  <%= image_tag "image.jpg", class: "w-full h-full object-cover" %>
<% end %>
```

## See Also

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/aspect_ratio.md`
- ViewComponent implementation: `docs/llm/vc/aspect_ratio.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/aspect-ratio
