# Resizable Component (Phlex)

Accessible resizable panel groups and layouts with keyboard support.

## Components

### UI::Resizable::PanelGroup

Container component that wraps resizable panels.

**Path:** `app/components/ui/resizable/panel_group.rb`

**Parameters:**
- `direction` (String, default: `"horizontal"`) - Layout direction: "horizontal" or "vertical"
- `keyboard_resize_by` (Integer, default: `10`) - Percentage to resize by on keyboard input
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

### UI::Resizable::Panel

Individual resizable panel within a panel group.

**Path:** `app/components/ui/resizable/panel.rb`

**Parameters:**
- `default_size` (Integer/Float, optional) - Initial size as percentage (0-100)
- `min_size` (Integer/Float, optional) - Minimum size as percentage
- `max_size` (Integer/Float, optional) - Maximum size as percentage
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

### UI::Resizable::Handle

Draggable handle between resizable panels.

**Path:** `app/components/ui/resizable/handle.rb`

**Parameters:**
- `with_handle` (Boolean, default: `false`) - Show visible grip icon
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

## Usage Examples

### Basic Horizontal Layout

```ruby
render UI::Resizable::PanelGroup.new(direction: "horizontal", classes: "min-h-[200px] rounded-lg border") do
  render UI::Resizable::Panel.new(default_size: 50) do
    div(class: "flex h-full items-center justify-center p-6") do
      span(class: "font-semibold") { "One" }
    end
  end
  render UI::Resizable::Handle.new
  render UI::Resizable::Panel.new(default_size: 50) do
    div(class: "flex h-full items-center justify-center p-6") do
      span(class: "font-semibold") { "Two" }
    end
  end
end
```

### Vertical Layout

```ruby
render UI::Resizable::PanelGroup.new(direction: "vertical", classes: "min-h-[200px] rounded-lg border") do
  render UI::Resizable::Panel.new(default_size: 25) do
    div(class: "flex h-full items-center justify-center p-6") do
      span(class: "font-semibold") { "Top" }
    end
  end
  render UI::Resizable::Handle.new
  render UI::Resizable::Panel.new(default_size: 75) do
    div(class: "flex h-full items-center justify-center p-6") do
      span(class: "font-semibold") { "Bottom" }
    end
  end
end
```

### With Handle Grip Icon

```ruby
render UI::Resizable::PanelGroup.new(direction: "horizontal", classes: "min-h-[200px] rounded-lg border") do
  render UI::Resizable::Panel.new(default_size: 50) do
    "Left"
  end
  render UI::Resizable::Handle.new(with_handle: true)
  render UI::Resizable::Panel.new(default_size: 50) do
    "Right"
  end
end
```

### Nested Panels (shadcn Demo)

```ruby
render UI::Resizable::PanelGroup.new(direction: "horizontal", classes: "max-w-md rounded-lg border") do
  render UI::Resizable::Panel.new(default_size: 50) do
    div(class: "flex h-[200px] items-center justify-center p-6") do
      span(class: "font-semibold") { "One" }
    end
  end
  render UI::Resizable::Handle.new
  render UI::Resizable::Panel.new(default_size: 50) do
    render UI::Resizable::PanelGroup.new(direction: "vertical") do
      render UI::Resizable::Panel.new(default_size: 25) do
        div(class: "flex h-full items-center justify-center p-6") do
          span(class: "font-semibold") { "Two" }
        end
      end
      render UI::Resizable::Handle.new
      render UI::Resizable::Panel.new(default_size: 75) do
        div(class: "flex h-full items-center justify-center p-6") do
          span(class: "font-semibold") { "Three" }
        end
      end
    end
  end
end
```

### With Constraints

```ruby
render UI::Resizable::PanelGroup.new(direction: "horizontal", classes: "min-h-[200px] rounded-lg border") do
  render UI::Resizable::Panel.new(default_size: 50, min_size: 20, max_size: 80) do
    "Constrained panel (min 20%, max 80%)"
  end
  render UI::Resizable::Handle.new(with_handle: true)
  render UI::Resizable::Panel.new(default_size: 50, min_size: 20, max_size: 80) do
    "Constrained panel (min 20%, max 80%)"
  end
end
```

### Sidebar Layout

```ruby
render UI::Resizable::PanelGroup.new(direction: "horizontal", classes: "min-h-[300px] rounded-lg border") do
  render UI::Resizable::Panel.new(default_size: 20, min_size: 15, max_size: 30) do
    div(class: "flex h-full flex-col bg-muted/30 p-4") do
      span(class: "font-semibold mb-4") { "Sidebar" }
      ul(class: "space-y-2 text-sm text-muted-foreground") do
        li(class: "hover:text-foreground cursor-pointer") { "Dashboard" }
        li(class: "hover:text-foreground cursor-pointer") { "Projects" }
        li(class: "hover:text-foreground cursor-pointer") { "Settings" }
      end
    end
  end
  render UI::Resizable::Handle.new(with_handle: true)
  render UI::Resizable::Panel.new(default_size: 80) do
    div(class: "flex h-full items-center justify-center p-6") do
      span(class: "text-muted-foreground") { "Main Content Area" }
    end
  end
end
```

## Events

The component dispatches the following Stimulus events:

- `ui--resizable:resizeStart` - When dragging begins
- `ui--resizable:resize` - During resize (contains `detail.sizes` array)
- `ui--resizable:resizeEnd` - When dragging ends

## Keyboard Support

- `ArrowLeft` / `ArrowRight` (horizontal group) or `ArrowUp` / `ArrowDown` (vertical group) - Resize the panel before the handle; arrows across the axis are left to the page (scrolling)
- `Home` - Minimize the panel before the handle
- `End` - Maximize the panel before the handle
- `Enter` - Collapse the panel before the handle to its `min_size`, press again to restore it

## Accessibility

- Handles have `role="separator"` and `aria-orientation` (`vertical` in a horizontal group)
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` are the size, `min_size` and `max_size` of the panel before the handle, set on connect and kept in sync
- `aria-controls` points at that panel (it gets a per-instance id; an `id` you pass is kept). Give the panel an `aria-label` and the handle is named after it, or pass `aria-label` to the handle
- Full keyboard navigation support
- Focus visible styling on handles

## Common Mistakes

- **Wrong:** Using `UI::Resizable.new` (module, not component)
- **Correct:** Using `UI::Resizable::PanelGroup.new`, `UI::Resizable::Panel.new`, `UI::Resizable::Handle.new`
