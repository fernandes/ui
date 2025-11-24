# Drawer Component (ERB)

A mobile-first drawer component that slides in from the edge of the screen with gesture-based drag-to-close functionality.

## Component Structure

```
UI::Drawer::Drawer          # Root container
├── UI::Drawer::Trigger     # Button to open drawer
├── UI::Drawer::Overlay     # Background overlay
└── UI::Drawer::Content     # Main drawer panel
    ├── UI::Drawer::Handle  # Drag handle (optional)
    ├── UI::Drawer::Header  # Header container (optional)
    │   ├── UI::Drawer::Title       # Title text
    │   └── UI::Drawer::Description # Description text
    ├── (custom content)
    └── UI::Drawer::Footer  # Footer container (optional)
        └── UI::Drawer::Close # Close button
```

## Parameters

### Drawer (Root)
- `open` (Boolean, default: `false`) - Initial open state
- `direction` (String, default: `"bottom"`) - Slide direction: `"bottom"`, `"top"`, `"left"`, `"right"`
- `dismissible` (Boolean, default: `true`) - Allow closing via drag/overlay/escape
- `modal` (Boolean, default: `true`) - Block background interaction when open
- `snap_points` (Array, optional) - Snap positions (e.g., `[0.25, 0.5, 1]` for percentages or `["148px", "355px", 1]` for mixed)
- `active_snap_point` (Integer, optional) - Initial snap point index (default: last index)
- `fade_from_index` (Integer, optional) - Overlay fade threshold (default: last snap point)
- `snap_to_sequential_point` (Boolean, default: `false`) - Prevent velocity-based snap skipping
- `handle_only` (Boolean, default: `false`) - Restrict dragging to handle only
- `reposition_inputs` (Boolean, default: `true`) - Reposition when mobile keyboard appears
- `classes` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Trigger
- `as_child` (Boolean, default: `false`) - Use composition pattern (see asChild section)
- `**attributes` (Hash) - Additional HTML attributes

### Overlay
- `open` (Boolean, default: `false`) - Open state (usually not needed)
- `classes` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Content
- `open` (Boolean, default: `false`) - Open state (usually not needed)
- `direction` (String, default: `"bottom"`) - Must match root Drawer direction
- `classes` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Handle
- `classes` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Header / Footer
- `classes` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Title / Description
- `classes` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Close
- `variant` (Symbol, default: `:outline`) - Button variant (`:default`, `:destructive`, `:outline`, `:secondary`, `:ghost`, `:link`)
- `size` (Symbol, default: `:default`) - Button size (`:default`, `:sm`, `:lg`, `:icon`)
- `classes` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

## Basic Usage

```erb
<%= render "ui/drawer/drawer" do %>
  <%= render "ui/drawer/trigger" do %>
    Open Drawer
  <% end %>

  <%= render "ui/drawer/overlay" %>

  <%= render "ui/drawer/content" do %>
    <%= render "ui/drawer/handle" %>

    <%= render "ui/drawer/header" do %>
      <%= render "ui/drawer/title" do %>
        Drawer Title
      <% end %>
      <%= render "ui/drawer/description" do %>
        Drawer description text.
      <% end %>
    <% end %>

    <div class="p-4">
      <!-- Your content here -->
    </div>

    <%= render "ui/drawer/footer" do %>
      <%= render "ui/button/button", variant: :default do %>
        Submit
      <% end %>
      <%= render "ui/drawer/close" do %>
        Cancel
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Direction Variants

```erb
<!-- Bottom (default) -->
<%= render "ui/drawer/drawer", direction: "bottom" do %>
  <%= render "ui/drawer/trigger" do %>
    Bottom
  <% end %>
  <%= render "ui/drawer/overlay" %>
  <%= render "ui/drawer/content", direction: "bottom" do %>
    <%= render "ui/drawer/handle" %>
    <div class="p-4">Content</div>
  <% end %>
<% end %>

<!-- Top -->
<%= render "ui/drawer/drawer", direction: "top" do %>
  <%= render "ui/drawer/trigger" do %>
    Top
  <% end %>
  <%= render "ui/drawer/overlay" %>
  <%= render "ui/drawer/content", direction: "top" do %>
    <%= render "ui/drawer/handle" %>
    <div class="p-4">Content</div>
  <% end %>
<% end %>

<!-- Left -->
<%= render "ui/drawer/drawer", direction: "left" do %>
  <%= render "ui/drawer/trigger" do %>
    Left
  <% end %>
  <%= render "ui/drawer/overlay" %>
  <%= render "ui/drawer/content", direction: "left" do %>
    <div class="p-4">Content</div>
  <% end %>
<% end %>

<!-- Right -->
<%= render "ui/drawer/drawer", direction: "right" do %>
  <%= render "ui/drawer/trigger" do %>
    Right
  <% end %>
  <%= render "ui/drawer/overlay" %>
  <%= render "ui/drawer/content", direction: "right" do %>
    <div class="p-4">Content</div>
  <% end %>
<% end %>
```

## Snap Points

Snap points allow the drawer to stop at specific positions when dragged:

```erb
<%= render "ui/drawer/drawer",
  modal: false,
  snap_points: [0.25, 0.5, 1],
  fade_from_index: 0 do %>
  <%= render "ui/drawer/trigger" do %>
    Open with Snap Points
  <% end %>

  <%= render "ui/drawer/overlay" %>

  <%= render "ui/drawer/content", classes: "min-h-screen" do %>
    <%= render "ui/drawer/handle" %>
    <%= render "ui/drawer/header" do %>
      <%= render "ui/drawer/title" do %>
        Snap Points
      <% end %>
      <%= render "ui/drawer/description" do %>
        Drag to different heights.
      <% end %>
    <% end %>

    <div class="p-4">
      <p>First snap: 25% of viewport height</p>
      <p>Second snap: 50% of viewport height</p>
      <p>Third snap: 100% of viewport height</p>
    </div>
  <% end %>
<% end %>
```

**Snap Points Options:**
- Values between 0-1 represent percentage of viewport (e.g., `0.5` = 50%)
- Pixel values as strings (e.g., `"148px"`)
- Value of `1` means full viewport height
- `fade_from_index` controls when overlay starts fading (default: last index)

## Handle-Only Dragging

Restrict dragging to the handle only - useful when drawer contains scrollable content:

```erb
<%= render "ui/drawer/drawer", handle_only: true do %>
  <%= render "ui/drawer/trigger" do %>
    Handle-Only Drawer
  <% end %>
  <%= render "ui/drawer/overlay" %>

  <%= render "ui/drawer/content" do %>
    <%= render "ui/drawer/handle" %>

    <%= render "ui/drawer/header" do %>
      <%= render "ui/drawer/title" do %>
        Handle-Only Mode
      <% end %>
      <%= render "ui/drawer/description" do %>
        Only the handle is draggable.
      <% end %>
    <% end %>

    <div class="p-4 space-y-2" data-vaul-scrollable>
      <p>Try dragging this content - it won't close the drawer.</p>
      <p>Only dragging the handle will close it.</p>
      <% 10.times do |i| %>
        <p>Scrollable content item <%= i + 1 %></p>
      <% end %>
    </div>
  <% end %>
<% end %>
```

**Note:** Add `data-vaul-scrollable` attribute to scrollable containers inside handle-only drawers.

## Non-Modal Mode

Background remains interactive when drawer is open:

```erb
<%= render "ui/drawer/drawer", modal: false do %>
  <%= render "ui/drawer/trigger" do %>
    Non-Modal Drawer
  <% end %>
  <%= render "ui/drawer/overlay" %>

  <%= render "ui/drawer/content" do %>
    <%= render "ui/drawer/handle" %>
    <%= render "ui/drawer/header" do %>
      <%= render "ui/drawer/title" do %>
        Non-Modal
      <% end %>
      <%= render "ui/drawer/description" do %>
        Page remains interactive.
      <% end %>
    <% end %>
    <div class="p-4">
      <p>Try clicking the page behind this drawer.</p>
    </div>
  <% end %>
<% end %>
```

## Responsive Dialog Pattern

Show Dialog on desktop (≥768px) and Drawer on mobile (<768px):

```erb
<div data-controller="ui--responsive-dialog" data-ui--responsive-dialog-breakpoint-value="768">
  <!-- Mobile: Drawer -->
  <div class="md:hidden" data-ui--responsive-dialog-target="drawer">
    <%= render "ui/drawer/drawer" do %>
      <%= render "ui/drawer/trigger" do %>
        Edit Profile (Mobile)
      <% end %>
      <%= render "ui/drawer/overlay" %>
      <%= render "ui/drawer/content" do %>
        <%= render "ui/drawer/handle" %>
        <%= render "ui/drawer/header", classes: "text-left" do %>
          <%= render "ui/drawer/title" do %>
            Edit profile
          <% end %>
          <%= render "ui/drawer/description" do %>
            Make changes to your profile.
          <% end %>
        <% end %>
        <div class="grid gap-4 px-4">
          <%= render "ui/label/label", for: "name-drawer" do %>
            Name
          <% end %>
          <%= render "ui/input/input", id: "name-drawer", value: "Pedro Duarte" %>
        </div>
        <%= render "ui/drawer/footer", classes: "pt-2" do %>
          <%= render "ui/button/button", variant: :default do %>
            Save changes
          <% end %>
          <%= render "ui/drawer/close" do %>
            Cancel
          <% end %>
        <% end %>
      <% end %>
    <% end %>
  </div>

  <!-- Desktop: Dialog -->
  <div class="hidden md:block" data-ui--responsive-dialog-target="dialog">
    <%= render "ui/dialog/dialog" do %>
      <%= render "ui/dialog/trigger" do %>
        Edit Profile (Desktop)
      <% end %>
      <%= render "ui/dialog/overlay" %>
      <%= render "ui/dialog/content" do %>
        <%= render "ui/dialog/header" do %>
          <%= render "ui/dialog/title" do %>
            Edit profile
          <% end %>
          <%= render "ui/dialog/description" do %>
            Make changes to your profile.
          <% end %>
        <% end %>
        <div class="grid gap-4 py-4">
          <%= render "ui/label/label", for: "name" do %>
            Name
          <% end %>
          <%= render "ui/input/input", id: "name", value: "Pedro Duarte" %>
        </div>
        <%= render "ui/dialog/footer" do %>
          <%= render "ui/button/button", variant: :default do %>
            Save changes
          <% end %>
        <% end %>
      <% end %>
    <% end %>
  </div>
</div>
```

## asChild Pattern

The `Trigger` component supports the `as_child` pattern for composition:

```erb
<!-- ❌ WRONG: Creates button inside button (invalid HTML) -->
<%= render "ui/drawer/trigger" do %>
  <%= render "ui/button/button" do %>
    Open
  <% end %>
<% end %>

<!-- ✅ CORRECT: asChild merges trigger behavior with Button -->
<%= render "ui/drawer/trigger", as_child: true do |attrs| %>
  <%= render "ui/button/button", **attrs do %>
    Open
  <% end %>
<% end %>

<!-- ✅ CORRECT: Can also be used with custom elements -->
<%= render "ui/drawer/trigger", as_child: true do |attrs| %>
  <%= content_tag :a, href: "#", **attrs do %>
    <span class="font-semibold">Open Drawer</span>
  <% end %>
<% end %>
```

## Common Mistakes

### ❌ Wrong: Missing direction prop on Content
```erb
<%= render "ui/drawer/drawer", direction: "right" do %>
  <%= render "ui/drawer/content" do %>  <!-- Missing direction! -->
    Content
  <% end %>
<% end %>
```

### ✅ Correct: Content direction matches Drawer
```erb
<%= render "ui/drawer/drawer", direction: "right" do %>
  <%= render "ui/drawer/content", direction: "right" do %>
    Content
  <% end %>
<% end %>
```

### ❌ Wrong: Nested buttons without asChild
```erb
<%= render "ui/drawer/trigger" do %>
  <%= render "ui/button/button" do %>
    Open
  <% end %>
<% end %>
```

### ✅ Correct: Use asChild for composition
```erb
<%= render "ui/drawer/trigger", as_child: true do |attrs| %>
  <%= render "ui/button/button", **attrs do %>
    Open
  <% end %>
<% end %>
```

### ❌ Wrong: Using `hidden` class for animated containers
```erb
<%= render "ui/drawer/content", classes: "hidden" do %>
  <!-- Animations won't work! -->
<% end %>
```

### ✅ Correct: Let controller manage visibility
```erb
<%= render "ui/drawer/content" do %>
  <!-- Controller handles visibility via data-state -->
<% end %>
```

## Accessibility

- ARIA attributes automatically applied (`role="dialog"`, `aria-modal`)
- Focus trap in modal mode
- Escape key closes drawer (when `dismissible: true`)
- Keyboard navigation support

## Events

The drawer dispatches custom events:

```javascript
// Listen for drawer open
element.addEventListener('drawer:open', (event) => {
  console.log('Drawer opened', event.detail.open) // true
})

// Listen for drawer close
element.addEventListener('drawer:close', (event) => {
  console.log('Drawer closed', event.detail.open) // false
})
```

## Features

- ✅ Drag-to-close gesture with velocity detection
- ✅ Four directions: bottom, top, left, right
- ✅ Snap points for tiered content reveal
- ✅ Modal and non-modal modes
- ✅ Handle-only dragging mode
- ✅ Input repositioning for mobile keyboards
- ✅ Responsive dialog pattern (Dialog on desktop, Drawer on mobile)
- ✅ Smooth animations with cubic-bezier easing
- ✅ Accessibility support (ARIA, focus trap, keyboard)

## Based on Vaul

This implementation is based on [Vaul](https://vaul.emilkowal.ski), a mobile-first drawer component for React, ported to Rails with Stimulus.
