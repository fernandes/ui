# Scroll Area Component - ERB

Augments native scroll functionality for custom, cross-browser styling.

## Basic Usage

```erb
<%= render "ui/scroll_area/scroll_area", classes: "h-[200px] w-[350px] rounded-md border p-4" do %>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold">Tags</h3>
    <!-- Content here -->
  </div>
<% end %>
```

## Components

### ScrollArea (Root Container)

- **Partial**: `ui/scroll_area/scroll_area`
- **File**: `app/views/ui/scroll_area/_scroll_area.html.erb`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Injects attributes into child element |
| `type` | String | `"hover"` | Scrollbar visibility behavior |
| `scroll_hide_delay` | Integer | `600` | Delay in ms before hiding scrollbar |
| `classes` | String | `""` | Additional CSS classes (MUST include height/width) |
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Other Components

- `scroll_area_viewport` - Automatically rendered
- `scroll_area_scrollbar` - Automatically rendered (orientation parameter for horizontal)
- `scroll_area_thumb` - Automatically rendered
- `scroll_area_corner` - Automatically rendered

## Examples

### Basic Vertical Scroll

```erb
<%= render "ui/scroll_area/scroll_area", classes: "h-[200px] w-[350px] rounded-md border p-4" do %>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold">Tags</h3>
    <div class="space-y-1">
      <% %w[v1.2.0 v1.1.0 v1.0.0].each do |tag| %>
        <div class="text-sm text-muted-foreground"><%= tag %></div>
      <% end %>
    </div>
  </div>
<% end %>
```

### Horizontal Scrolling

```erb
<div class="relative w-96 whitespace-nowrap rounded-md border" data-controller="ui--scroll-area">
  <div data-ui-scroll-area-viewport data-ui--scroll-area-target="viewport" 
       class="size-full rounded-[inherit]" style="overflow-x: scroll; overflow-y: hidden;">
    <div style="min-width: 100%; display: table;">
      <div class="flex w-max space-x-4 p-4">
        <% 10.times do |i| %>
          <div class="h-[200px] w-[200px] rounded-md bg-muted flex items-center justify-center shrink-0">
            <span class="text-4xl font-semibold"><%= i + 1 %></span>
          </div>
        <% end %>
      </div>
    </div>
  </div>
  <%= render "ui/scroll_area/scroll_area_scrollbar", orientation: "horizontal" %>
</div>
```

## Important Notes

### ⚠️ MUST Set Height/Width

```erb
<%# ❌ WRONG: No height %>
<%= render "ui/scroll_area/scroll_area", classes: "w-full border" do %>
  <!-- Won't scroll properly! -->
<% end %>

<%# ✅ CORRECT: Height specified %>
<%= render "ui/scroll_area/scroll_area", classes: "h-[200px] w-full border" do %>
  <!-- Will scroll properly -->
<% end %>
```
