# Drawer Component (ViewComponent)

A mobile-first drawer component that slides in from the edge of the screen with gesture-based drag-to-close functionality.

## Component Structure

```
UI::Drawer::DrawerComponent          # Root container
├── UI::Drawer::TriggerComponent     # Button to open drawer
├── UI::Drawer::OverlayComponent     # Background overlay
└── UI::Drawer::ContentComponent     # Main drawer panel
    ├── UI::Drawer::HandleComponent  # Drag handle (optional)
    ├── UI::Drawer::HeaderComponent  # Header container (optional)
    │   ├── UI::Drawer::TitleComponent       # Title text
    │   └── UI::Drawer::DescriptionComponent # Description text
    ├── (custom content)
    └── UI::Drawer::FooterComponent  # Footer container (optional)
        └── UI::Drawer::CloseComponent # Close button
```

## Component Paths

- **Root:** `UI::Drawer::DrawerComponent`
- **Trigger:** `UI::Drawer::TriggerComponent`
- **Overlay:** `UI::Drawer::OverlayComponent`
- **Content:** `UI::Drawer::ContentComponent`
- **Handle:** `UI::Drawer::HandleComponent`
- **Header:** `UI::Drawer::HeaderComponent`
- **Title:** `UI::Drawer::TitleComponent`
- **Description:** `UI::Drawer::DescriptionComponent`
- **Footer:** `UI::Drawer::FooterComponent`
- **Close:** `UI::Drawer::CloseComponent`

## Parameters

### DrawerComponent (Root)
- `open:` (Boolean, default: `false`) - Initial open state
- `direction:` (String, default: `"bottom"`) - Slide direction: `"bottom"`, `"top"`, `"left"`, `"right"`
- `dismissible:` (Boolean, default: `true`) - Allow closing via drag/overlay/escape
- `modal:` (Boolean, default: `true`) - Block background interaction when open
- `snap_points:` (Array, optional) - Snap positions (e.g., `[0.25, 0.5, 1]` for percentages or `["148px", "355px", 1]` for mixed)
- `active_snap_point:` (Integer, optional) - Initial snap point index (default: last index)
- `fade_from_index:` (Integer, optional) - Overlay fade threshold (default: last snap point)
- `snap_to_sequential_point:` (Boolean, default: `false`) - Prevent velocity-based snap skipping
- `handle_only:` (Boolean, default: `false`) - Restrict dragging to handle only
- `reposition_inputs:` (Boolean, default: `true`) - Reposition when mobile keyboard appears
- `classes:` (String, default: `""`) - Additional CSS classes
- `attributes:` (Hash, default: `{}`) - Additional HTML attributes

### TriggerComponent
- `as_child:` (Boolean, default: `false`) - Use composition pattern (see asChild section)
- `attributes:` (Hash, default: `{}`) - Additional HTML attributes

### OverlayComponent
- `open:` (Boolean, default: `false`) - Open state (usually not needed)
- `classes:` (String, default: `""`) - Additional CSS classes
- `attributes:` (Hash, default: `{}`) - Additional HTML attributes

### ContentComponent
- `open:` (Boolean, default: `false`) - Open state (usually not needed)
- `direction:` (String, default: `"bottom"`) - Must match root Drawer direction
- `classes:` (String, default: `""`) - Additional CSS classes
- `attributes:` (Hash, default: `{}`) - Additional HTML attributes

### HandleComponent
- `classes:` (String, default: `""`) - Additional CSS classes
- `attributes:` (Hash, default: `{}`) - Additional HTML attributes

### HeaderComponent / FooterComponent
- `classes:` (String, default: `""`) - Additional CSS classes
- `attributes:` (Hash, default: `{}`) - Additional HTML attributes

### TitleComponent / DescriptionComponent
- `classes:` (String, default: `""`) - Additional CSS classes
- `attributes:` (Hash, default: `{}`) - Additional HTML attributes

### CloseComponent
- `variant:` (Symbol, default: `:outline`) - Button variant (`:default`, `:destructive`, `:outline`, `:secondary`, `:ghost`, `:link`)
- `size:` (Symbol, default: `:default`) - Button size (`:default`, `:sm`, `:lg`, `:icon`)
- `classes:` (String, default: `""`) - Additional CSS classes
- `attributes:` (Hash, default: `{}`) - Additional HTML attributes

## Basic Usage

```erb
<%= render UI::Drawer::DrawerComponent.new do %>
  <%= render UI::Drawer::TriggerComponent.new do %>
    Open Drawer
  <% end %>

  <%= render UI::Drawer::OverlayComponent.new %>

  <%= render UI::Drawer::ContentComponent.new do %>
    <%= render UI::Drawer::HandleComponent.new %>

    <%= render UI::Drawer::HeaderComponent.new do %>
      <%= render UI::Drawer::TitleComponent.new do %>
        Drawer Title
      <% end %>
      <%= render UI::Drawer::DescriptionComponent.new do %>
        Drawer description text.
      <% end %>
    <% end %>

    <div class="p-4">
      <!-- Your content here -->
    </div>

    <%= render UI::Drawer::FooterComponent.new do %>
      <%= render UI::Button::ButtonComponent.new do %>
        Submit
      <% end %>
      <%= render UI::Drawer::CloseComponent.new do %>
        Cancel
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

## Direction Variants

```erb
<!-- Bottom (default) -->
<%= render UI::Drawer::DrawerComponent.new(direction: "bottom") do %>
  <%= render UI::Drawer::TriggerComponent.new { "Bottom" } %>
  <%= render UI::Drawer::OverlayComponent.new %>
  <%= render UI::Drawer::ContentComponent.new(direction: "bottom") do %>
    <%= render UI::Drawer::HandleComponent.new %>
    <div class="p-4">Content</div>
  <% end %>
<% end %>

<!-- Top -->
<%= render UI::Drawer::DrawerComponent.new(direction: "top") do %>
  <%= render UI::Drawer::TriggerComponent.new { "Top" } %>
  <%= render UI::Drawer::OverlayComponent.new %>
  <%= render UI::Drawer::ContentComponent.new(direction: "top") do %>
    <%= render UI::Drawer::HandleComponent.new %>
    <div class="p-4">Content</div>
  <% end %>
<% end %>

<!-- Left -->
<%= render UI::Drawer::DrawerComponent.new(direction: "left") do %>
  <%= render UI::Drawer::TriggerComponent.new { "Left" } %>
  <%= render UI::Drawer::OverlayComponent.new %>
  <%= render UI::Drawer::ContentComponent.new(direction: "left") do %>
    <div class="p-4">Content</div>
  <% end %>
<% end %>

<!-- Right -->
<%= render UI::Drawer::DrawerComponent.new(direction: "right") do %>
  <%= render UI::Drawer::TriggerComponent.new { "Right" } %>
  <%= render UI::Drawer::OverlayComponent.new %>
  <%= render UI::Drawer::ContentComponent.new(direction: "right") do %>
    <div class="p-4">Content</div>
  <% end %>
<% end %>
```

## Snap Points

Snap points allow the drawer to stop at specific positions when dragged:

```erb
<%= render UI::Drawer::DrawerComponent.new(
  modal: false,
  snap_points: [0.25, 0.5, 1],
  fade_from_index: 0
) do %>
  <%= render UI::Drawer::TriggerComponent.new do %>
    Open with Snap Points
  <% end %>

  <%= render UI::Drawer::OverlayComponent.new %>

  <%= render UI::Drawer::ContentComponent.new(classes: "min-h-screen") do %>
    <%= render UI::Drawer::HandleComponent.new %>

    <%= render UI::Drawer::HeaderComponent.new do %>
      <%= render UI::Drawer::TitleComponent.new { "Snap Points" } %>
      <%= render UI::Drawer::DescriptionComponent.new { "Drag to different heights." } %>
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
- `fade_from_index:` controls when overlay starts fading (default: last index)

## Handle-Only Dragging

Restrict dragging to the handle only - useful when drawer contains scrollable content:

```erb
<%= render UI::Drawer::DrawerComponent.new(handle_only: true) do %>
  <%= render UI::Drawer::TriggerComponent.new { "Handle-Only Drawer" } %>
  <%= render UI::Drawer::OverlayComponent.new %>

  <%= render UI::Drawer::ContentComponent.new do %>
    <%= render UI::Drawer::HandleComponent.new %>

    <%= render UI::Drawer::HeaderComponent.new do %>
      <%= render UI::Drawer::TitleComponent.new { "Handle-Only Mode" } %>
      <%= render UI::Drawer::DescriptionComponent.new { "Only the handle is draggable." } %>
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
<%= render UI::Drawer::DrawerComponent.new(modal: false) do %>
  <%= render UI::Drawer::TriggerComponent.new { "Non-Modal Drawer" } %>
  <%= render UI::Drawer::OverlayComponent.new %>

  <%= render UI::Drawer::ContentComponent.new do %>
    <%= render UI::Drawer::HandleComponent.new %>

    <%= render UI::Drawer::HeaderComponent.new do %>
      <%= render UI::Drawer::TitleComponent.new { "Non-Modal" } %>
      <%= render UI::Drawer::DescriptionComponent.new { "Page remains interactive." } %>
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
    <%= render UI::Drawer::DrawerComponent.new do %>
      <%= render UI::Drawer::TriggerComponent.new { "Edit Profile (Mobile)" } %>
      <%= render UI::Drawer::OverlayComponent.new %>
      <%= render UI::Drawer::ContentComponent.new do %>
        <%= render UI::Drawer::HandleComponent.new %>
        <%= render UI::Drawer::HeaderComponent.new(classes: "text-left") do %>
          <%= render UI::Drawer::TitleComponent.new { "Edit profile" } %>
          <%= render UI::Drawer::DescriptionComponent.new do %>
            Make changes to your profile.
          <% end %>
        <% end %>
        <div class="grid gap-4 px-4">
          <%= render UI::Label::LabelComponent.new(for: "name-drawer") { "Name" } %>
          <%= render UI::Input::InputComponent.new(id: "name-drawer", value: "Pedro Duarte") %>
        </div>
        <%= render UI::Drawer::FooterComponent.new(classes: "pt-2") do %>
          <%= render UI::Button::ButtonComponent.new { "Save changes" } %>
          <%= render UI::Drawer::CloseComponent.new { "Cancel" } %>
        <% end %>
      <% end %>
    <% end %>
  </div>

  <!-- Desktop: Dialog -->
  <div class="hidden md:block" data-ui--responsive-dialog-target="dialog">
    <%= render UI::Dialog::DialogComponent.new do %>
      <%= render UI::Dialog::TriggerComponent.new { "Edit Profile (Desktop)" } %>
      <%= render UI::Dialog::OverlayComponent.new %>
      <%= render UI::Dialog::ContentComponent.new do %>
        <%= render UI::Dialog::HeaderComponent.new do %>
          <%= render UI::Dialog::TitleComponent.new { "Edit profile" } %>
          <%= render UI::Dialog::DescriptionComponent.new do %>
            Make changes to your profile.
          <% end %>
        <% end %>
        <div class="grid gap-4 py-4">
          <%= render UI::Label::LabelComponent.new(for: "name") { "Name" } %>
          <%= render UI::Input::InputComponent.new(id: "name", value: "Pedro Duarte") %>
        </div>
        <%= render UI::Dialog::FooterComponent.new do %>
          <%= render UI::Button::ButtonComponent.new { "Save changes" } %>
        <% end %>
      <% end %>
    <% end %>
  </div>
</div>
```

## asChild Pattern

The `TriggerComponent` supports the `as_child` pattern for composition:

```erb
<!-- ❌ WRONG: Creates button inside button (invalid HTML) -->
<%= render UI::Drawer::TriggerComponent.new do %>
  <%= render UI::Button::ButtonComponent.new { "Open" } %>
<% end %>

<!-- ✅ CORRECT: asChild merges trigger behavior with Button -->
<%= render UI::Drawer::TriggerComponent.new(as_child: true) do |attrs| %>
  <%= render UI::Button::ButtonComponent.new(**attrs) { "Open" } %>
<% end %>

<!-- ✅ CORRECT: Can also be used with custom elements -->
<%= render UI::Drawer::TriggerComponent.new(as_child: true) do |attrs| %>
  <a href="#" <%= tag.attributes(attrs) %>>
    <span class="font-semibold">Open Drawer</span>
  </a>
<% end %>
```

## Common Mistakes

### ❌ Wrong: Module instead of component class
```erb
<%= render UI::Drawer.new do %>  <!-- UI::Drawer is a module! -->
  ...
<% end %>
```

### ✅ Correct: Use full component path with Component suffix
```erb
<%= render UI::Drawer::DrawerComponent.new do %>
  ...
<% end %>
```

### ❌ Wrong: Missing Component suffix
```erb
<%= render UI::Drawer::Drawer.new do %>  <!-- This is the Phlex class! -->
  ...
<% end %>
```

### ✅ Correct: ViewComponent requires Component suffix
```erb
<%= render UI::Drawer::DrawerComponent.new do %>
  ...
<% end %>
```

### ❌ Wrong: Missing direction prop on Content
```erb
<%= render UI::Drawer::DrawerComponent.new(direction: "right") do %>
  <%= render UI::Drawer::ContentComponent.new do %>  <!-- Missing direction! -->
    Content
  <% end %>
<% end %>
```

### ✅ Correct: Content direction matches Drawer
```erb
<%= render UI::Drawer::DrawerComponent.new(direction: "right") do %>
  <%= render UI::Drawer::ContentComponent.new(direction: "right") do %>
    Content
  <% end %>
<% end %>
```

### ❌ Wrong: Nested buttons without asChild
```erb
<%= render UI::Drawer::TriggerComponent.new do %>
  <%= render UI::Button::ButtonComponent.new { "Open" } %>
<% end %>
```

### ✅ Correct: Use asChild for composition
```erb
<%= render UI::Drawer::TriggerComponent.new(as_child: true) do |attrs| %>
  <%= render UI::Button::ButtonComponent.new(**attrs) { "Open" } %>
<% end %>
```

### ❌ Wrong: Using Hash for attributes parameter
```erb
<%= render UI::Drawer::ContentComponent.new({ class: "my-class" }) do %>
  <!-- Syntax error! -->
<% end %>
```

### ✅ Correct: Use named parameter syntax
```erb
<%= render UI::Drawer::ContentComponent.new(classes: "my-class") do %>
  ...
<% end %>
```

### ❌ Wrong: Using `hidden` class for animated containers
```erb
<%= render UI::Drawer::ContentComponent.new(classes: "hidden") do %>
  <!-- Animations won't work! -->
<% end %>
```

### ✅ Correct: Let controller manage visibility
```erb
<%= render UI::Drawer::ContentComponent.new do %>
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
