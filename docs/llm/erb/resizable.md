# Resizable Component (ERB)

Accessible resizable panel groups and layouts with keyboard support.

## Partials

### Panel Group

**Path:** `ui/resizable/_panel_group.html.erb`

**Parameters:**
- `direction` (String, default: `"horizontal"`) - Layout direction: "horizontal" or "vertical"
- `keyboard_resize_by` (Integer, default: `10`) - Percentage to resize by on keyboard input
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

### Panel

**Path:** `ui/resizable/_panel.html.erb`

**Parameters:**
- `default_size` (Integer/Float, optional) - Initial size as percentage (0-100)
- `min_size` (Integer/Float, optional) - Minimum size as percentage
- `max_size` (Integer/Float, optional) - Maximum size as percentage
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

### Handle

**Path:** `ui/resizable/_handle.html.erb`

**Parameters:**
- `with_handle` (Boolean, default: `false`) - Show visible grip icon
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

## Usage Examples

### Basic Horizontal Layout

```erb
<%= render "ui/resizable/panel_group", direction: "horizontal", classes: "min-h-[200px] rounded-lg border" do %>
  <%= render "ui/resizable/panel", default_size: 50 do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">One</span>
    </div>
  <% end %>
  <%= render "ui/resizable/handle" %>
  <%= render "ui/resizable/panel", default_size: 50 do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Two</span>
    </div>
  <% end %>
<% end %>
```

### Vertical Layout

```erb
<%= render "ui/resizable/panel_group", direction: "vertical", classes: "min-h-[200px] rounded-lg border" do %>
  <%= render "ui/resizable/panel", default_size: 25 do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Top</span>
    </div>
  <% end %>
  <%= render "ui/resizable/handle" %>
  <%= render "ui/resizable/panel", default_size: 75 do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Bottom</span>
    </div>
  <% end %>
<% end %>
```

### With Handle Grip Icon

```erb
<%= render "ui/resizable/panel_group", direction: "horizontal", classes: "min-h-[200px] rounded-lg border" do %>
  <%= render "ui/resizable/panel", default_size: 50 do %>
    Left
  <% end %>
  <%= render "ui/resizable/handle", with_handle: true %>
  <%= render "ui/resizable/panel", default_size: 50 do %>
    Right
  <% end %>
<% end %>
```

### Nested Panels (shadcn Demo)

```erb
<%= render "ui/resizable/panel_group", direction: "horizontal", classes: "max-w-md rounded-lg border md:min-w-[450px]" do %>
  <%= render "ui/resizable/panel", default_size: 50 do %>
    <div class="flex h-[200px] items-center justify-center p-6">
      <span class="font-semibold">One</span>
    </div>
  <% end %>
  <%= render "ui/resizable/handle" %>
  <%= render "ui/resizable/panel", default_size: 50 do %>
    <%= render "ui/resizable/panel_group", direction: "vertical" do %>
      <%= render "ui/resizable/panel", default_size: 25 do %>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      <% end %>
      <%= render "ui/resizable/handle" %>
      <%= render "ui/resizable/panel", default_size: 75 do %>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Three</span>
        </div>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Constraints

```erb
<%= render "ui/resizable/panel_group", direction: "horizontal", classes: "min-h-[200px] rounded-lg border" do %>
  <%= render "ui/resizable/panel", default_size: 50, min_size: 20, max_size: 80 do %>
    Constrained panel (min 20%, max 80%)
  <% end %>
  <%= render "ui/resizable/handle", with_handle: true %>
  <%= render "ui/resizable/panel", default_size: 50, min_size: 20, max_size: 80 do %>
    Constrained panel (min 20%, max 80%)
  <% end %>
<% end %>
```

### Sidebar Layout

```erb
<%= render "ui/resizable/panel_group", direction: "horizontal", classes: "min-h-[300px] rounded-lg border" do %>
  <%= render "ui/resizable/panel", default_size: 20, min_size: 15, max_size: 30 do %>
    <div class="flex h-full flex-col bg-muted/30 p-4">
      <span class="font-semibold mb-4">Sidebar</span>
      <ul class="space-y-2 text-sm text-muted-foreground">
        <li class="hover:text-foreground cursor-pointer">Dashboard</li>
        <li class="hover:text-foreground cursor-pointer">Projects</li>
        <li class="hover:text-foreground cursor-pointer">Settings</li>
      </ul>
    </div>
  <% end %>
  <%= render "ui/resizable/handle", with_handle: true %>
  <%= render "ui/resizable/panel", default_size: 80 do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="text-muted-foreground">Main Content Area</span>
    </div>
  <% end %>
<% end %>
```

## Events

The component dispatches the following Stimulus events:

- `ui--resizable:resizeStart` - When dragging begins
- `ui--resizable:resize` - During resize (contains `detail.sizes` array)
- `ui--resizable:resizeEnd` - When dragging ends

## Keyboard Support

- `ArrowLeft` / `ArrowUp` - Decrease left panel size
- `ArrowRight` / `ArrowDown` - Increase left panel size
- `Home` - Minimize left panel
- `End` - Maximize left panel

## Accessibility

- Handles have `role="separator"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for screen readers
- Full keyboard navigation support
- Focus visible styling on handles

## Common Mistakes

- **Wrong:** `<%= render "ui/resizable" %>` (no such partial)
- **Correct:** Use `"ui/resizable/panel_group"`, `"ui/resizable/panel"`, `"ui/resizable/handle"`
