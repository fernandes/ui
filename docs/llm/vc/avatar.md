# Avatar - ViewComponent

## Component Paths

```ruby
UI::Avatar::AvatarComponent
UI::Avatar::ImageComponent
UI::Avatar::FallbackComponent
```

## Description

An image element with a fallback for representing users. The Avatar component automatically handles image loading states and displays fallback content (typically initials) when images fail to load or are still loading.

Based on [shadcn/ui Avatar](https://ui.shadcn.com/docs/components/avatar) and [Radix UI Avatar](https://www.radix-ui.com/primitives/docs/components/avatar).

## Basic Usage

```erb
<%= render(UI::Avatar::AvatarComponent.new) do %>
  <%= render(UI::Avatar::ImageComponent.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )) %>
  <%= render(UI::Avatar::FallbackComponent.new) { "CN" } %>
<% end %>
```

## Parameters

### UI::Avatar::AvatarComponent

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes (id, data-*, aria-*, etc.)

**Example:**
```erb
<%= render(UI::Avatar::AvatarComponent.new(classes: "size-12")) do %>
  <!-- Content -->
<% end %>
```

### UI::Avatar::ImageComponent

**Parameters:**
- `src:` String (required) - Image source URL
- `alt:` String - Alternative text for the image (default: "")
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes

**Example:**
```erb
<%= render(UI::Avatar::ImageComponent.new(
  src: "https://github.com/shadcn.png",
  alt: "User avatar"
)) %>
```

### UI::Avatar::FallbackComponent

**Parameters:**
- `classes:` String - Additional Tailwind CSS classes to merge
- `**attributes` Hash - Any additional HTML attributes

**Example:**
```erb
<%= render(UI::Avatar::FallbackComponent.new) { "CN" } %>
```

## Examples

### Basic Avatar

```erb
<%= render(UI::Avatar::AvatarComponent.new) do %>
  <%= render(UI::Avatar::ImageComponent.new(
    src: "https://github.com/shadcn.png",
    alt: "@shadcn"
  )) %>
  <%= render(UI::Avatar::FallbackComponent.new) { "CN" } %>
<% end %>
```

### Custom Size

```erb
<%# Large avatar %>
<%= render(UI::Avatar::AvatarComponent.new(classes: "size-16")) do %>
  <%= render(UI::Avatar::ImageComponent.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )) %>
  <%= render(UI::Avatar::FallbackComponent.new(classes: "text-lg")) { "CN" } %>
<% end %>

<%# Small avatar %>
<%= render(UI::Avatar::AvatarComponent.new(classes: "size-6")) do %>
  <%= render(UI::Avatar::ImageComponent.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )) %>
  <%= render(UI::Avatar::FallbackComponent.new(classes: "text-xs")) { "CN" } %>
<% end %>
```

### Colored Fallback

```erb
<%= render(UI::Avatar::AvatarComponent.new) do %>
  <%= render(UI::Avatar::ImageComponent.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )) %>
  <%= render(UI::Avatar::FallbackComponent.new(
    classes: "bg-primary text-primary-foreground"
  )) { "AB" } %>
<% end %>
```

### Rounded Square Avatar

```erb
<%= render(UI::Avatar::AvatarComponent.new(classes: "rounded-lg")) do %>
  <%= render(UI::Avatar::ImageComponent.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )) %>
  <%= render(UI::Avatar::FallbackComponent.new(classes: "rounded-lg")) { "CN" } %>
<% end %>
```

### Avatar List (User Group)

```erb
<div class="flex -space-x-2">
  <% [1, 2, 3, 4].each do |i| %>
    <%= render(UI::Avatar::AvatarComponent.new(classes: "ring-2 ring-background")) do %>
      <%= render(UI::Avatar::ImageComponent.new(
        src: "https://i.pravatar.cc/150?img=#{i}",
        alt: "User #{i}"
      )) %>
      <%= render(UI::Avatar::FallbackComponent.new) { "U#{i}" } %>
    <% end %>
  <% end %>
</div>
```

### Avatar with Status Indicator

```erb
<div class="relative">
  <%= render(UI::Avatar::AvatarComponent.new) do %>
    <%= render(UI::Avatar::ImageComponent.new(
      src: "https://github.com/shadcn.png",
      alt: "User"
    )) %>
    <%= render(UI::Avatar::FallbackComponent.new) { "CN" } %>
  <% end %>

  <%# Status indicator %>
  <span class="absolute bottom-0 right-0 block size-3 rounded-full bg-green-500 ring-2 ring-background"></span>
</div>
```

### Avatar with Icon Fallback

```erb
<%= render(UI::Avatar::AvatarComponent.new) do %>
  <%= render(UI::Avatar::ImageComponent.new(
    src: "https://github.com/shadcn.png",
    alt: "User"
  )) %>
  <%= render(UI::Avatar::FallbackComponent.new) do %>
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
    <%= render(UI::Avatar::AvatarComponent.new) do %>
      <%= render(UI::Avatar::ImageComponent.new(
        src: "https://github.com/shadcn.png",
        alt: "User"
      )) %>
      <%= render(UI::Avatar::FallbackComponent.new) { "CN" } %>
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
  <%= render(UI::Avatar::AvatarComponent.new) do %>
    <%= render(UI::Avatar::ImageComponent.new(
      src: "https://github.com/shadcn.png",
      alt: "User"
    )) %>
    <%= render(UI::Avatar::FallbackComponent.new) { "CN" } %>
  <% end %>
  <span class="hidden md:inline">Chester Nelson</span>
</button>
```

### Avatar with User Data

```erb
<% user = OpenStruct.new(name: "Chester Nelson", avatar: "https://github.com/shadcn.png", initials: "CN") %>

<%= render(UI::Avatar::AvatarComponent.new) do %>
  <%= render(UI::Avatar::ImageComponent.new(
    src: user.avatar,
    alt: "#{user.name}'s profile picture"
  )) %>
  <%= render(UI::Avatar::FallbackComponent.new) { user.initials } %>
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
<%= render(UI::Avatar::AvatarComponent.new) do %>
  <%= render(UI::Avatar::ImageComponent.new(src: "image.jpg", alt: "User")) %>
  <%# Missing fallback! %>
<% end %>
```

**Why it's wrong:** If the image fails to load, nothing will be displayed.

### ✅ Correct - Always include fallback

```erb
<%= render(UI::Avatar::AvatarComponent.new) do %>
  <%= render(UI::Avatar::ImageComponent.new(src: "image.jpg", alt: "User")) %>
  <%= render(UI::Avatar::FallbackComponent.new) { "U" } %>
<% end %>
```

### ❌ Wrong - Missing parentheses in render

```erb
<%= render UI::Avatar::AvatarComponent.new { %>
  <%# Block won't be passed correctly without parentheses %>
<% } %>
```

**Why it's wrong:** ViewComponent requires parentheses around the component instantiation when using block syntax.

### ✅ Correct - Use parentheses with block

```erb
<%= render(UI::Avatar::AvatarComponent.new) do %>
  <%# Correct: parentheses around component, do...end for block %>
<% end %>
```

### ❌ Wrong - Mismatched border radius

```erb
<%= render(UI::Avatar::AvatarComponent.new(classes: "rounded-lg")) do %>
  <%= render(UI::Avatar::ImageComponent.new(src: "image.jpg", alt: "User")) %>
  <%= render(UI::Avatar::FallbackComponent.new) { "CN" } %>
<% end %>
```

**Why it's wrong:** Fallback has default rounded-full class that won't match the avatar container.

### ✅ Correct - Match border radius on fallback

```erb
<%= render(UI::Avatar::AvatarComponent.new(classes: "rounded-lg")) do %>
  <%= render(UI::Avatar::ImageComponent.new(src: "image.jpg", alt: "User")) %>
  <%= render(UI::Avatar::FallbackComponent.new(classes: "rounded-lg")) { "CN" } %>
<% end %>
```

### ❌ Wrong - Missing alt text

```erb
<%= render(UI::Avatar::ImageComponent.new(src: "image.jpg")) %>
```

**Why it's wrong:** Poor accessibility for screen readers.

### ✅ Correct - Always include alt text

```erb
<%= render(UI::Avatar::ImageComponent.new(
  src: "image.jpg",
  alt: "Chester Nelson's profile picture"
)) %>
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

- ViewComponent guide: `docs/llm/vc.md`
- Phlex implementation: `docs/llm/phlex/avatar.md`
- ERB implementation: `docs/llm/erb/avatar.md`
- shadcn/ui: https://ui.shadcn.com/docs/components/avatar
- Radix UI: https://www.radix-ui.com/primitives/docs/components/avatar
