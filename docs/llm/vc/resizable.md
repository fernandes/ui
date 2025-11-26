# Resizable Component (ViewComponent)

Accessible resizable panel groups and layouts with keyboard support.

## Components

### UI::Resizable::PanelGroupComponent

Container component that wraps resizable panels.

**Path:** `app/components/ui/resizable/panel_group_component.rb`

**Parameters:**
- `direction` (String, default: `"horizontal"`) - Layout direction: "horizontal" or "vertical"
- `keyboard_resize_by` (Integer, default: `10`) - Percentage to resize by on keyboard input
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

### UI::Resizable::PanelComponent

Individual resizable panel within a panel group.

**Path:** `app/components/ui/resizable/panel_component.rb`

**Parameters:**
- `default_size` (Integer/Float, optional) - Initial size as percentage (0-100)
- `min_size` (Integer/Float, optional) - Minimum size as percentage
- `max_size` (Integer/Float, optional) - Maximum size as percentage
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

### UI::Resizable::HandleComponent

Draggable handle between resizable panels.

**Path:** `app/components/ui/resizable/handle_component.rb`

**Parameters:**
- `with_handle` (Boolean, default: `false`) - Show visible grip icon
- `classes` (String, default: `""`) - Additional CSS classes
- `attributes` (Hash, default: `{}`) - Additional HTML attributes

## Usage Examples

### Basic Horizontal Layout

```erb
<%= render UI::Resizable::PanelGroupComponent.new(direction: "horizontal", classes: "min-h-[200px] rounded-lg border") do %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 50) do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">One</span>
    </div>
  <% end %>
  <%= render UI::Resizable::HandleComponent.new %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 50) do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Two</span>
    </div>
  <% end %>
<% end %>
```

### Vertical Layout

```erb
<%= render UI::Resizable::PanelGroupComponent.new(direction: "vertical", classes: "min-h-[200px] rounded-lg border") do %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 25) do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Top</span>
    </div>
  <% end %>
  <%= render UI::Resizable::HandleComponent.new %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 75) do %>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Bottom</span>
    </div>
  <% end %>
<% end %>
```

### With Handle Grip Icon

```erb
<%= render UI::Resizable::PanelGroupComponent.new(direction: "horizontal", classes: "min-h-[200px] rounded-lg border") do %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 50) do %>
    Left
  <% end %>
  <%= render UI::Resizable::HandleComponent.new(with_handle: true) %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 50) do %>
    Right
  <% end %>
<% end %>
```

### Nested Panels (shadcn Demo)

```erb
<%= render UI::Resizable::PanelGroupComponent.new(direction: "horizontal", classes: "max-w-md rounded-lg border md:min-w-[450px]") do %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 50) do %>
    <div class="flex h-[200px] items-center justify-center p-6">
      <span class="font-semibold">One</span>
    </div>
  <% end %>
  <%= render UI::Resizable::HandleComponent.new %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 50) do %>
    <%= render UI::Resizable::PanelGroupComponent.new(direction: "vertical") do %>
      <%= render UI::Resizable::PanelComponent.new(default_size: 25) do %>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      <% end %>
      <%= render UI::Resizable::HandleComponent.new %>
      <%= render UI::Resizable::PanelComponent.new(default_size: 75) do %>
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
<%= render UI::Resizable::PanelGroupComponent.new(direction: "horizontal", classes: "min-h-[200px] rounded-lg border") do %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 50, min_size: 20, max_size: 80) do %>
    Constrained panel (min 20%, max 80%)
  <% end %>
  <%= render UI::Resizable::HandleComponent.new(with_handle: true) %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 50, min_size: 20, max_size: 80) do %>
    Constrained panel (min 20%, max 80%)
  <% end %>
<% end %>
```

### Sidebar Layout

```erb
<%= render UI::Resizable::PanelGroupComponent.new(direction: "horizontal", classes: "min-h-[300px] rounded-lg border") do %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 20, min_size: 15, max_size: 30) do %>
    <div class="flex h-full flex-col bg-muted/30 p-4">
      <span class="font-semibold mb-4">Sidebar</span>
      <ul class="space-y-2 text-sm text-muted-foreground">
        <li class="hover:text-foreground cursor-pointer">Dashboard</li>
        <li class="hover:text-foreground cursor-pointer">Projects</li>
        <li class="hover:text-foreground cursor-pointer">Settings</li>
      </ul>
    </div>
  <% end %>
  <%= render UI::Resizable::HandleComponent.new(with_handle: true) %>
  <%= render UI::Resizable::PanelComponent.new(default_size: 80) do %>
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

- **Wrong:** `UI::Resizable::PanelGroup.new` (Phlex component, not ViewComponent)
- **Correct:** `UI::Resizable::PanelGroupComponent.new`, `UI::Resizable::PanelComponent.new`, `UI::Resizable::HandleComponent.new`
