# Drawer Component (Phlex)

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

## Component Paths

- **Root:** `UI::Drawer::Drawer`
- **Trigger:** `UI::Drawer::Trigger`
- **Overlay:** `UI::Drawer::Overlay`
- **Content:** `UI::Drawer::Content`
- **Handle:** `UI::Drawer::Handle`
- **Header:** `UI::Drawer::Header`
- **Title:** `UI::Drawer::Title`
- **Description:** `UI::Drawer::Description`
- **Footer:** `UI::Drawer::Footer`
- **Close:** `UI::Drawer::Close`

## Parameters

### Drawer (Root)
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
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Trigger
- `as_child:` (Boolean, default: `false`) - Use composition pattern (see asChild section)
- `**attributes` (Hash) - Additional HTML attributes

### Overlay
- `open:` (Boolean, default: `false`) - Open state (usually not needed)
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Content
- `open:` (Boolean, default: `false`) - Open state (usually not needed)
- `direction:` (String, default: `"bottom"`) - Must match root Drawer direction
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Handle
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Header / Footer
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Title / Description
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

### Close
- `variant:` (Symbol, default: `:outline`) - Button variant (`:default`, `:destructive`, `:outline`, `:secondary`, `:ghost`, `:link`)
- `size:` (Symbol, default: `:default`) - Button size (`:default`, `:sm`, `:lg`, `:icon`)
- `classes:` (String, optional) - Additional CSS classes
- `**attributes` (Hash) - Additional HTML attributes

## Basic Usage

```ruby
render UI::Drawer::Drawer.new do
  render UI::Drawer::Trigger.new do
    plain "Open Drawer"
  end

  render UI::Drawer::Overlay.new

  render UI::Drawer::Content.new do
    render UI::Drawer::Handle.new

    render UI::Drawer::Header.new do
      render UI::Drawer::Title.new do
        plain "Drawer Title"
      end
      render UI::Drawer::Description.new do
        plain "Drawer description text."
      end
    end

    div(class: "p-4") do
      # Your content here
    end

    render UI::Drawer::Footer.new do
      render UI::Button::Button.new do
        plain "Submit"
      end
      render UI::Drawer::Close.new do
        plain "Cancel"
      end
    end
  end
end
```

## Direction Variants

```ruby
# Bottom (default)
render UI::Drawer::Drawer.new(direction: "bottom") do
  render UI::Drawer::Trigger.new { plain "Bottom" }
  render UI::Drawer::Overlay.new
  render UI::Drawer::Content.new(direction: "bottom") do
    render UI::Drawer::Handle.new
    div(class: "p-4") { plain "Content" }
  end
end

# Top
render UI::Drawer::Drawer.new(direction: "top") do
  render UI::Drawer::Trigger.new { plain "Top" }
  render UI::Drawer::Overlay.new
  render UI::Drawer::Content.new(direction: "top") do
    render UI::Drawer::Handle.new
    div(class: "p-4") { plain "Content" }
  end
end

# Left
render UI::Drawer::Drawer.new(direction: "left") do
  render UI::Drawer::Trigger.new { plain "Left" }
  render UI::Drawer::Overlay.new
  render UI::Drawer::Content.new(direction: "left") do
    div(class: "p-4") { plain "Content" }
  end
end

# Right
render UI::Drawer::Drawer.new(direction: "right") do
  render UI::Drawer::Trigger.new { plain "Right" }
  render UI::Drawer::Overlay.new
  render UI::Drawer::Content.new(direction: "right") do
    div(class: "p-4") { plain "Content" }
  end
end
```

## Snap Points

Snap points allow the drawer to stop at specific positions when dragged:

```ruby
render UI::Drawer::Drawer.new(
  modal: false,
  snap_points: [0.25, 0.5, 1],
  fade_from_index: 0
) do
  render UI::Drawer::Trigger.new do
    plain "Open with Snap Points"
  end

  render UI::Drawer::Overlay.new

  render UI::Drawer::Content.new(classes: "min-h-screen") do
    render UI::Drawer::Handle.new

    render UI::Drawer::Header.new do
      render UI::Drawer::Title.new { plain "Snap Points" }
      render UI::Drawer::Description.new { plain "Drag to different heights." }
    end

    div(class: "p-4") do
      p { plain "First snap: 25% of viewport height" }
      p { plain "Second snap: 50% of viewport height" }
      p { plain "Third snap: 100% of viewport height" }
    end
  end
end
```

**Snap Points Options:**
- Values between 0-1 represent percentage of viewport (e.g., `0.5` = 50%)
- Pixel values as strings (e.g., `"148px"`)
- Value of `1` means full viewport height
- `fade_from_index:` controls when overlay starts fading (default: last index)

## Handle-Only Dragging

Restrict dragging to the handle only - useful when drawer contains scrollable content:

```ruby
render UI::Drawer::Drawer.new(handle_only: true) do
  render UI::Drawer::Trigger.new { plain "Handle-Only Drawer" }
  render UI::Drawer::Overlay.new

  render UI::Drawer::Content.new do
    render UI::Drawer::Handle.new

    render UI::Drawer::Header.new do
      render UI::Drawer::Title.new { plain "Handle-Only Mode" }
      render UI::Drawer::Description.new { plain "Only the handle is draggable." }
    end

    div(class: "p-4 space-y-2", data_vaul_scrollable: "") do
      p { plain "Try dragging this content - it won't close the drawer." }
      p { plain "Only dragging the handle will close it." }
      10.times do |i|
        p { plain "Scrollable content item #{i + 1}" }
      end
    end
  end
end
```

**Note:** Add `data_vaul_scrollable: ""` attribute to scrollable containers inside handle-only drawers.

## Non-Modal Mode

Background remains interactive when drawer is open:

```ruby
render UI::Drawer::Drawer.new(modal: false) do
  render UI::Drawer::Trigger.new { plain "Non-Modal Drawer" }
  render UI::Drawer::Overlay.new

  render UI::Drawer::Content.new do
    render UI::Drawer::Handle.new

    render UI::Drawer::Header.new do
      render UI::Drawer::Title.new { plain "Non-Modal" }
      render UI::Drawer::Description.new { plain "Page remains interactive." }
    end

    div(class: "p-4") do
      p { plain "Try clicking the page behind this drawer." }
    end
  end
end
```

## asChild Pattern

The `Trigger` component supports the `as_child` pattern for composition:

```ruby
# ❌ WRONG: Creates button inside button (invalid HTML)
render UI::Drawer::Trigger.new do
  render UI::Button::Button.new { plain "Open" }
end

# ✅ CORRECT: asChild merges trigger behavior with Button
render UI::Drawer::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs) { plain "Open" }
end

# ✅ CORRECT: Can also be used with custom elements
render UI::Drawer::Trigger.new(as_child: true) do |attrs|
  a(href: "#", **attrs) do
    span(class: "font-semibold") { plain "Open Drawer" }
  end
end
```

## Common Mistakes

### ❌ Wrong: Module instead of component class
```ruby
render UI::Drawer.new do  # UI::Drawer is a module!
  # ...
end
```

### ✅ Correct: Use full component path
```ruby
render UI::Drawer::Drawer.new do  # UI::Drawer::Drawer is the component
  # ...
end
```

### ❌ Wrong: Missing direction prop on Content
```ruby
render UI::Drawer::Drawer.new(direction: "right") do
  render UI::Drawer::Content.new do  # Missing direction!
    plain "Content"
  end
end
```

### ✅ Correct: Content direction matches Drawer
```ruby
render UI::Drawer::Drawer.new(direction: "right") do
  render UI::Drawer::Content.new(direction: "right") do
    plain "Content"
  end
end
```

### ❌ Wrong: Nested buttons without asChild
```ruby
render UI::Drawer::Trigger.new do
  render UI::Button::Button.new { plain "Open" }
end
```

### ✅ Correct: Use asChild for composition
```ruby
render UI::Drawer::Trigger.new(as_child: true) do |attrs|
  render UI::Button::Button.new(**attrs) { plain "Open" }
end
```

### ❌ Wrong: Using `classes:` without colon
```ruby
render UI::Drawer::Content.new(classes "my-class") do
  # Syntax error!
end
```

### ✅ Correct: Use named parameter syntax
```ruby
render UI::Drawer::Content.new(classes: "my-class") do
  # ...
end
```

### ❌ Wrong: Using `hidden` class for animated containers
```ruby
render UI::Drawer::Content.new(classes: "hidden") do
  # Animations won't work!
end
```

### ✅ Correct: Let controller manage visibility
```ruby
render UI::Drawer::Content.new do
  # Controller handles visibility via data-state
end
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
