# Scroll Area Component - ViewComponent

Augments native scroll functionality for custom, cross-browser styling.

## Basic Usage

```ruby
<%= render UI::ScrollArea::ScrollAreaComponent.new(classes: "h-[200px] w-[350px] rounded-md border p-4") do %>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold">Tags</h3>
    <!-- Content here -->
  </div>
<% end %>
```

## Components

### ScrollArea (Root) - UI::ScrollArea::ScrollAreaComponent

**Parameters**:
- `type:` - Scrollbar visibility behavior (default: "hover")
- `scroll_hide_delay:` - Delay in ms (default: 600)
- `classes:` - **Required** - Must include height/width
- `**attributes` - Additional HTML attributes

### Other Components

- `ViewportComponent` - Automatically rendered
- `ScrollbarComponent` - Automatically rendered (orientation: "vertical" or "horizontal")
- `ThumbComponent` - Automatically rendered
- `CornerComponent` - Automatically rendered

## Examples

### Basic Vertical Scroll

```ruby
<%= render UI::ScrollArea::ScrollAreaComponent.new(classes: "h-[200px] w-[350px] rounded-md border p-4") do %>
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

### Different Sizes

```ruby
# Small
<%= render UI::ScrollArea::ScrollAreaComponent.new(classes: "h-24 w-full rounded-md border p-4") do %>
  <!-- Content -->
<% end %>

# Large
<%= render UI::ScrollArea::ScrollAreaComponent.new(classes: "h-96 w-full rounded-md border p-4") do %>
  <!-- Content -->
<% end %>
```

## Important Notes

### ⚠️ MUST Set Height/Width

```ruby
# ❌ WRONG: No height
<%= render UI::ScrollArea::ScrollAreaComponent.new(classes: "w-full border") do %>
  <!-- Won't scroll! -->
<% end %>

# ✅ CORRECT: Height specified
<%= render UI::ScrollArea::ScrollAreaComponent.new(classes: "h-[200px] w-full border") do %>
  <!-- Will scroll properly -->
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing Component suffix

```ruby
<%= render UI::ScrollArea::ScrollArea.new { ... } %>
# ERROR: Only Phlex uses this naming
```

### ✅ Correct: Use Component suffix

```ruby
<%= render UI::ScrollArea::ScrollAreaComponent.new { ... } %>
```
