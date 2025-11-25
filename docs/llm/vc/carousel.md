# Carousel - ViewComponent

A carousel built with Embla Carousel for cycling through images or content.

## Components

### Carousel (Root Container)
- **Class**: `UI::Carousel::CarouselComponent`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes
- `orientation` (String, optional): Carousel orientation - `"horizontal"` (default) or `"vertical"`
- `opts` (Hash, optional): Embla Carousel options (see [Embla docs](https://www.embla-carousel.com/api/options/))
- `**attributes`: Additional HTML attributes

### Content (Viewport Wrapper)
- **Class**: `UI::Carousel::ContentComponent`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes
- `**attributes`: Additional HTML attributes

### Item (Carousel Slide)
- **Class**: `UI::Carousel::ItemComponent`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes for sizing/spacing (e.g., `"md:basis-1/2 lg:basis-1/3"`, `"pl-1"`)
- `**attributes`: Additional HTML attributes

### Previous Button
- **Class**: `UI::Carousel::PreviousComponent`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes
- `**attributes`: Additional HTML attributes

### Next Button
- **Class**: `UI::Carousel::NextComponent`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes
- `**attributes`: Additional HTML attributes

## Examples

### Basic Carousel

```erb
<%= render UI::Carousel::CarouselComponent.new do %>
  <%= render UI::Carousel::ContentComponent.new do %>
    <% 5.times do |i| %>
      <%= render UI::Carousel::ItemComponent.new do %>
        <div class="p-1">
          <div class="flex aspect-square items-center justify-center p-6 border rounded-lg">
            <span class="text-4xl font-semibold"><%= i + 1 %></span>
          </div>
        </div>
      <% end %>
    <% end %>
  <% end %>
  <%= render UI::Carousel::PreviousComponent.new %>
  <%= render UI::Carousel::NextComponent.new %>
<% end %>
```

### Sizes (Responsive Item Width)

```erb
<%= render UI::Carousel::CarouselComponent.new do %>
  <%= render UI::Carousel::ContentComponent.new do %>
    <% 5.times do |i| %>
      <%= render UI::Carousel::ItemComponent.new(classes: "md:basis-1/2 lg:basis-1/3") do %>
        <div class="p-1">
          <div class="flex aspect-square items-center justify-center p-6 border rounded-lg">
            <span class="text-3xl font-semibold"><%= i + 1 %></span>
          </div>
        </div>
      <% end %>
    <% end %>
  <% end %>
  <%= render UI::Carousel::PreviousComponent.new %>
  <%= render UI::Carousel::NextComponent.new %>
<% end %>
```

### Spacing

```erb
<%= render UI::Carousel::CarouselComponent.new(classes: "w-full max-w-sm") do %>
  <%= render UI::Carousel::ContentComponent.new(classes: "-ml-1") do %>
    <% 5.times do |i| %>
      <%= render UI::Carousel::ItemComponent.new(classes: "pl-1") do %>
        <div class="p-1">
          <div class="flex aspect-square items-center justify-center p-6 border rounded-lg">
            <span class="text-2xl font-semibold"><%= i + 1 %></span>
          </div>
        </div>
      <% end %>
    <% end %>
  <% end %>
  <%= render UI::Carousel::PreviousComponent.new %>
  <%= render UI::Carousel::NextComponent.new %>
<% end %>
```

### Orientation (Vertical)

```erb
<%= render UI::Carousel::CarouselComponent.new(orientation: "vertical", classes: "w-full max-w-xs", opts: { align: "start" }) do %>
  <%= render UI::Carousel::ContentComponent.new(classes: "-mt-1 h-[200px]") do %>
    <% 5.times do |i| %>
      <%= render UI::Carousel::ItemComponent.new(classes: "pt-1 md:basis-1/2") do %>
        <div class="p-1">
          <div class="flex items-center justify-center p-6 border rounded-lg min-h-[120px]">
            <span class="text-3xl font-semibold"><%= i + 1 %></span>
          </div>
        </div>
      <% end %>
    <% end %>
  <% end %>
  <%= render UI::Carousel::PreviousComponent.new %>
  <%= render UI::Carousel::NextComponent.new %>
<% end %>
```

## Features

- **Embla Carousel Integration**: Uses Embla Carousel vanilla JS for smooth, performant sliding
- **Orientation Support**: Horizontal (default) and vertical layouts
- **Keyboard Navigation**: Arrow keys navigate between slides
- **Button State Management**: Previous/Next buttons automatically disable when at boundaries
- **Flexible Sizing**: Control item width with Tailwind classes
- **Custom Spacing**: Adjust spacing between items with negative margins and padding
- **Accessible**: ARIA attributes for screen readers

## Common Mistakes

❌ **Wrong**: Using module instead of component
```erb
<%= render UI::Carousel do %>
```

✅ **Correct**: Use the full component class path
```erb
<%= render UI::Carousel::CarouselComponent.new do %>
```

❌ **Wrong**: Wrapping previous/next buttons in Content
```erb
<%= render UI::Carousel::ContentComponent.new do %>
  <%= render UI::Carousel::PreviousComponent.new %>
  ...
<% end %>
```

✅ **Correct**: Previous/Next are siblings of Content
```erb
<%= render UI::Carousel::ContentComponent.new do %>
  ...
<% end %>
<%= render UI::Carousel::PreviousComponent.new %>
<%= render UI::Carousel::NextComponent.new %>
```

❌ **Wrong**: Forgetting `.new`
```erb
<%= render UI::Carousel::CarouselComponent do %>
```

✅ **Correct**: Always call `.new`
```erb
<%= render UI::Carousel::CarouselComponent.new do %>
```
