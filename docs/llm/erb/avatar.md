# Avatar - ERB

## Component Paths

```erb
<%= render "ui/avatar/avatar" %>
<%= render "ui/avatar/avatar_image" %>
<%= render "ui/avatar/avatar_fallback" %>
```

## Description

An image element with a fallback for representing users. The Avatar component automatically handles image loading states and displays fallback content (typically initials) when images fail to load or are still loading.

Based on [shadcn/ui Avatar](https://ui.shadcn.com/docs/components/avatar) and [Radix UI Avatar](https://www.radix-ui.com/primitives/docs/components/avatar).

## Basic Usage

```erb
<%= render "ui/avatar/avatar" do %>
  <%= render "ui/avatar/avatar_image", src: "https://github.com/shadcn.png", alt: "User" %>
  <%= render "ui/avatar/avatar_fallback" do %>
    CN
  <% end %>
<% end %>
```

## Parameters

### ui/avatar/avatar

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge

**Example:**
```erb
<%= render "ui/avatar/avatar", classes: "size-12" do %>
  <!-- Content -->
<% end %>
```

### ui/avatar/avatar_image

**Parameters:**
- `src:` String (required) - Image source URL
- `alt:` String - Alternative text for the image (default: "")
- `classes:` String - Additional Tailwind CSS classes to merge

**Example:**
```erb
<%= render "ui/avatar/avatar_image",
           src: "https://github.com/shadcn.png",
           alt: "User avatar" %>
```

### ui/avatar/avatar_fallback

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge

**Example:**
```erb
<%= render "ui/avatar/avatar_fallback" do %>
  CN
<% end %>
```

## Examples

### Basic Avatar

```erb
<%= render "ui/avatar/avatar" do %>
  <%= render "ui/avatar/avatar_image",
             src: "https://github.com/shadcn.png",
             alt: "@shadcn" %>
  <%= render "ui/avatar/avatar_fallback" do %>
    CN
  <% end %>
<% end %>
```

### Custom Size

```erb
<%# Large avatar %>
<%= render "ui/avatar/avatar", classes: "size-16" do %>
  <%= render "ui/avatar/avatar_image",
             src: "https://github.com/shadcn.png",
             alt: "User" %>
  <%= render "ui/avatar/avatar_fallback", classes: "text-lg" do %>
    CN
  <% end %>
<% end %>

<%# Small avatar %>
<%= render "ui/avatar/avatar", classes: "size-6" do %>
  <%= render "ui/avatar/avatar_image",
             src: "https://github.com/shadcn.png",
             alt: "User" %>
  <%= render "ui/avatar/avatar_fallback", classes: "text-xs" do %>
    CN
  <% end %>
<% end %>
```

### Colored Fallback

```erb
<%= render "ui/avatar/avatar" do %>
  <%= render "ui/avatar/avatar_image",
             src: "https://github.com/shadcn.png",
             alt: "User" %>
  <%= render "ui/avatar/avatar_fallback",
             classes: "bg-primary text-primary-foreground" do %>
    AB
  <% end %>
<% end %>
```

### Rounded Square Avatar

```erb
<%= render "ui/avatar/avatar", classes: "rounded-lg" do %>
  <%= render "ui/avatar/avatar_image",
             src: "https://github.com/shadcn.png",
             alt: "User" %>
  <%= render "ui/avatar/avatar_fallback", classes: "rounded-lg" do %>
    CN
  <% end %>
<% end %>
```

### Avatar List (User Group)

```erb
<div class="flex -space-x-2">
  <% (1..4).each do |i| %>
    <%= render "ui/avatar/avatar", classes: "ring-2 ring-background" do %>
      <%= render "ui/avatar/avatar_image",
                 src: "https://i.pravatar.cc/150?img=#{i}",
                 alt: "User #{i}" %>
      <%= render "ui/avatar/avatar_fallback" do %>
        U<%= i %>
      <% end %>
    <% end %>
  <% end %>
</div>
```

### Avatar with Status Indicator

```erb
<div class="relative">
  <%= render "ui/avatar/avatar" do %>
    <%= render "ui/avatar/avatar_image",
               src: "https://github.com/shadcn.png",
               alt: "User" %>
    <%= render "ui/avatar/avatar_fallback" do %>
      CN
    <% end %>
  <% end %>

  <%# Status indicator %>
  <span class="absolute bottom-0 right-0 block size-3 rounded-full bg-green-500 ring-2 ring-background"></span>
</div>
```

### Avatar with Icon Fallback

```erb
<%= render "ui/avatar/avatar" do %>
  <%= render "ui/avatar/avatar_image",
             src: "https://github.com/shadcn.png",
             alt: "User" %>
  <%= render "ui/avatar/avatar_fallback" do %>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  <% end %>
<% end %>
```

## Common Patterns

### Avatar in Card Header

```erb
<div class="rounded-lg border bg-card p-6">
  <div class="flex items-center gap-4">
    <%= render "ui/avatar/avatar" do %>
      <%= render "ui/avatar/avatar_image",
                 src: "https://github.com/shadcn.png",
                 alt: "User" %>
      <%= render "ui/avatar/avatar_fallback" do %>
        CN
      <% end %>
    <% end %>

    <div>
      <h3 class="font-semibold">Chester Nelson</h3>
      <p class="text-sm text-muted-foreground">@chesternelson</p>
    </div>
  </div>
</div>
```

### Avatar Dropdown Trigger

```erb
<button class="flex items-center gap-2 rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2">
  <%= render "ui/avatar/avatar" do %>
    <%= render "ui/avatar/avatar_image",
               src: "https://github.com/shadcn.png",
               alt: "User" %>
    <%= render "ui/avatar/avatar_fallback" do %>
      CN
    <% end %>
  <% end %>
  <span class="hidden md:inline">Chester Nelson</span>
</button>
```

### Avatar with User Data

```erb
<% user = { name: "Chester Nelson", avatar: "https://github.com/shadcn.png", initials: "CN" } %>

<%= render "ui/avatar/avatar" do %>
  <%= render "ui/avatar/avatar_image",
             src: user[:avatar],
             alt: "#{user[:name]}'s profile picture" %>
  <%= render "ui/avatar/avatar_fallback" do %>
    <%= user[:initials] %>
  <% end %>
<% end %>
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

```erb
<%= render "ui/avatar/avatar" do %>
  <%= render "ui/avatar/avatar_image", src: "image.jpg", alt: "User" %>
  <%# Missing fallback! %>
<% end %>
```

**Why it's wrong:** If the image fails to load, nothing will be displayed.

### ✅ Correct - Always include fallback

```erb
<%= render "ui/avatar/avatar" do %>
  <%= render "ui/avatar/avatar_image", src: "image.jpg", alt: "User" %>
  <%= render "ui/avatar/avatar_fallback" do %>
    U
  <% end %>
<% end %>
```

### ❌ Wrong - Mismatched border radius

```erb
<%= render "ui/avatar/avatar", classes: "rounded-lg" do %>
  <%= render "ui/avatar/avatar_image", src: "image.jpg", alt: "User" %>
  <%= render "ui/avatar/avatar_fallback" do %>
    CN
  <% end %>
<% end %>
```

**Why it's wrong:** Fallback has default rounded-full class that won't match the avatar container.

### ✅ Correct - Match border radius on fallback

```erb
<%= render "ui/avatar/avatar", classes: "rounded-lg" do %>
  <%= render "ui/avatar/avatar_image", src: "image.jpg", alt: "User" %>
  <%= render "ui/avatar/avatar_fallback", classes: "rounded-lg" do %>
    CN
  <% end %>
<% end %>
```

### ❌ Wrong - Missing alt text

```erb
<%= render "ui/avatar/avatar_image", src: "image.jpg" %>
```

**Why it's wrong:** Poor accessibility for screen readers.

### ✅ Correct - Always include alt text

```erb
<%= render "ui/avatar/avatar_image",
           src: "image.jpg",
           alt: "Chester Nelson's profile picture" %>
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

- ERB guide: `docs/llm/erb.md`
- Phlex implementation: `docs/llm/phlex/avatar.md`
- ViewComponent implementation: `docs/llm/vc/avatar.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/avatar
- Radix UI: https://www.radix-ui.com/primitives/docs/components/avatar
