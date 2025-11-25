# Carousel - ERB

A carousel built with Embla Carousel for cycling through images or content.

## Components

### Carousel (Root Container)
- **Path**: `app/views/ui/carousel/_carousel.html.erb`
- **Usage**: `<%= render "ui/carousel/carousel" do %>`

**Parameters**:
- `classes` (String, optional): Additional CSS classes
- `orientation` (String, optional): Carousel orientation - `"horizontal"` (default) or `"vertical"`
- `opts` (Hash, optional): Embla Carousel options (see [Embla docs](https://www.embla-carousel.com/api/options/))
- `attributes` (Hash, optional): Additional HTML attributes

### Content (Viewport Wrapper)
- **Path**: `app/views/ui/carousel/_content.html.erb`
- **Usage**: `<%= render "ui/carousel/content" do %>`

**Parameters**:
- `classes` (String, optional): Additional CSS classes
- `attributes` (Hash, optional): Additional HTML attributes

### Item (Carousel Slide)
- **Path**: `app/views/ui/carousel/_item.html.erb`
- **Usage**: `<%= render "ui/carousel/item" do %>`

**Parameters**:
- `classes` (String, optional): Additional CSS classes for sizing/spacing (e.g., `"md:basis-1/2 lg:basis-1/3"`, `"pl-1"`)
- `attributes` (Hash, optional): Additional HTML attributes

### Previous Button
- **Path**: `app/views/ui/carousel/_previous.html.erb`
- **Usage**: `<%= render "ui/carousel/previous" %>`

**Parameters**:
- `classes` (String, optional): Additional CSS classes
- `attributes` (Hash, optional): Additional HTML attributes

### Next Button
- **Path**: `app/views/ui/carousel/_next.html.erb`
- **Usage**: `<%= render "ui/carousel/next" %>`

**Parameters**:
- `classes` (String, optional): Additional CSS classes
- `attributes` (Hash, optional): Additional HTML attributes

## Examples

### Basic Carousel

```erb
<%= render "ui/carousel/carousel" do %>
  <%= render "ui/carousel/content" do %>
    <% 5.times do |i| %>
      <%= render "ui/carousel/item" do %>
        <div class="p-1">
          <div class="flex aspect-square items-center justify-center p-6 border rounded-lg">
            <span class="text-4xl font-semibold"><%= i + 1 %></span>
          </div>
        </div>
      <% end %>
    <% end %>
  <% end %>
  <%= render "ui/carousel/previous" %>
  <%= render "ui/carousel/next" %>
<% end %>
```

### Sizes (Responsive Item Width)

```erb
<%= render "ui/carousel/carousel" do %>
  <%= render "ui/carousel/content" do %>
    <% 5.times do |i| %>
      <%= render "ui/carousel/item", classes: "md:basis-1/2 lg:basis-1/3" do %>
        <div class="p-1">
          <div class="flex aspect-square items-center justify-center p-6 border rounded-lg">
            <span class="text-3xl font-semibold"><%= i + 1 %></span>
          </div>
        </div>
      <% end %>
    <% end %>
  <% end %>
  <%= render "ui/carousel/previous" %>
  <%= render "ui/carousel/next" %>
<% end %>
```

### Spacing

```erb
<%= render "ui/carousel/carousel", classes: "w-full max-w-sm" do %>
  <%= render "ui/carousel/content", classes: "-ml-1" do %>
    <% 5.times do |i| %>
      <%= render "ui/carousel/item", classes: "pl-1" do %>
        <div class="p-1">
          <div class="flex aspect-square items-center justify-center p-6 border rounded-lg">
            <span class="text-2xl font-semibold"><%= i + 1 %></span>
          </div>
        </div>
      <% end %>
    <% end %>
  <% end %>
  <%= render "ui/carousel/previous" %>
  <%= render "ui/carousel/next" %>
<% end %>
```

### Orientation (Vertical)

```erb
<%= render "ui/carousel/carousel", orientation: "vertical", classes: "w-full max-w-xs", opts: { align: "start" } do %>
  <%= render "ui/carousel/content", classes: "-mt-1 h-[200px]" do %>
    <% 5.times do |i| %>
      <%= render "ui/carousel/item", classes: "pt-1 md:basis-1/2" do %>
        <div class="p-1">
          <div class="flex items-center justify-center p-6 border rounded-lg min-h-[120px]">
            <span class="text-3xl font-semibold"><%= i + 1 %></span>
          </div>
        </div>
      <% end %>
    <% end %>
  <% end %>
  <%= render "ui/carousel/previous" %>
  <%= render "ui/carousel/next" %>
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

❌ **Wrong**: Using `render partial:` syntax
```erb
<%= render partial: "ui/carousel/carousel" do %>
```

✅ **Correct**: Use string path
```erb
<%= render "ui/carousel/carousel" do %>
```

❌ **Wrong**: Wrapping previous/next buttons in Content
```erb
<%= render "ui/carousel/content" do %>
  <%= render "ui/carousel/previous" %>
  ...
<% end %>
```

✅ **Correct**: Previous/Next are siblings of Content
```erb
<%= render "ui/carousel/content" do %>
  ...
<% end %>
<%= render "ui/carousel/previous" %>
<%= render "ui/carousel/next" %>
```
