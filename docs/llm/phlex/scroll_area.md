# Scroll Area Component - Phlex

Augments native scroll functionality for custom, cross-browser styling.

## Basic Usage

```ruby
render UI::ScrollArea::ScrollArea.new(classes: "h-[200px] w-[350px] rounded-md border p-4") do
  div(class: "space-y-4") do
    h3(class: "text-sm font-semibold") { "Tags" }
    div(class: "space-y-1") do
      # Content here
    end
  end
end
```

## Components

### ScrollArea (Root Container)

- **Class**: `UI::ScrollArea::ScrollArea`
- **File**: `app/components/ui/scroll_area/scroll_area.rb`
- **Behavior Module**: `UI::ScrollAreaBehavior`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Yields attributes to block |
| `type` | String | `"hover"` | Scrollbar visibility ("hover", "scroll", "auto", "always") |
| `scroll_hide_delay` | Integer | `600` | Delay in ms before hiding scrollbar |
| `classes` | String | `""` | Additional CSS classes (set height/width here) |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### Viewport

- **Class**: `UI::ScrollArea::Viewport`
- **Note**: Automatically rendered by ScrollArea, rarely needs manual use

### Scrollbar

- **Class**: `UI::ScrollArea::Scrollbar`
- **Note**: Automatically rendered by ScrollArea

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `orientation` | String | `"vertical"` | "vertical" or "horizontal" |

### Thumb

- **Class**: `UI::ScrollArea::Thumb`
- **Note**: Automatically rendered by Scrollbar

### Corner

- **Class**: `UI::ScrollArea::Corner`
- **Note**: Automatically rendered by ScrollArea

## Examples

### Basic Vertical Scroll

```ruby
render UI::ScrollArea::ScrollArea.new(classes: "h-[200px] w-[350px] rounded-md border p-4") do
  div(class: "space-y-4") do
    h3(class: "text-sm font-semibold") { "Tags" }
    div(class: "space-y-1") do
      %w[v1.2.0 v1.1.0 v1.0.0 v0.9.0].each do |tag|
        div(class: "text-sm text-muted-foreground") { tag }
      end
    end
  end
end
```

### Horizontal Scrolling

```ruby
render UI::ScrollArea::ScrollArea.new(classes: "w-96 whitespace-nowrap rounded-md border") do
  div(class: "flex w-max space-x-4 p-4") do
    10.times do |i|
      div(class: "h-[200px] w-[200px] rounded-md bg-muted flex items-center justify-center shrink-0") do
        span(class: "text-4xl font-semibold text-muted-foreground") { (i + 1).to_s }
      end
    end
  end
end
```

### Different Sizes

```ruby
# Small
render UI::ScrollArea::ScrollArea.new(classes: "h-24 w-full rounded-md border p-4") do
  # Content
end

# Large
render UI::ScrollArea::ScrollArea.new(classes: "h-96 w-full rounded-md border p-4") do
  # Content
end
```

## Important Notes

### ⚠️ MUST Set Height/Width

Scroll Area REQUIRES height/width to be set via `classes:` parameter:

```ruby
# ❌ WRONG: No height/width
render UI::ScrollArea::ScrollArea.new do
  # Won't scroll - no dimensions!
end

# ✅ CORRECT: Height and width specified
render UI::ScrollArea::ScrollArea.new(classes: "h-[200px] w-[350px]") do
  # Will scroll properly
end
```

### Native Scrollbar is Hidden

The component hides the native browser scrollbar and shows a custom styled scrollbar instead. This provides:
- Consistent appearance across browsers
- Custom styling that matches your theme
- Better visual integration with your design

## Error Prevention

### ❌ Wrong: Missing height

```ruby
render UI::ScrollArea::ScrollArea.new(classes: "w-full border") do
  # No height - won't scroll!
end
```

### ✅ Correct: Include height

```ruby
render UI::ScrollArea::ScrollArea.new(classes: "h-[200px] w-full border") do
  # Will scroll properly
end
```
