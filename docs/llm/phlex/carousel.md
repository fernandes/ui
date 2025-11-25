# Carousel - Phlex

A carousel built with Embla Carousel for cycling through images or content.

## Components

### Carousel (Root Container)
- **Class**: `UI::Carousel::Carousel`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes
- `orientation` (String, optional): Carousel orientation - `"horizontal"` (default) or `"vertical"`
- `opts` (Hash, optional): Embla Carousel options (see [Embla docs](https://www.embla-carousel.com/api/options/))
- `**attributes`: Additional HTML attributes

### Content (Viewport Wrapper)
- **Class**: `UI::Carousel::Content`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes
- `**attributes`: Additional HTML attributes

### Item (Carousel Slide)
- **Class**: `UI::Carousel::Item`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes for sizing/spacing (e.g., `"md:basis-1/2 lg:basis-1/3"`, `"pl-1"`)
- `**attributes`: Additional HTML attributes

### Previous Button
- **Class**: `UI::Carousel::Previous`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes
- `**attributes`: Additional HTML attributes

### Next Button
- **Class**: `UI::Carousel::Next`
- **Module**: `UI::Carousel`

**Constructor Parameters**:
- `classes` (String, optional): Additional CSS classes
- `**attributes`: Additional HTML attributes

## Examples

### Basic Carousel

```ruby
render UI::Carousel::Carousel.new do
  render UI::Carousel::Content.new do
    5.times do |i|
      render UI::Carousel::Item.new do
        div(class: "p-1") do
          div(class: "flex aspect-square items-center justify-center p-6 border rounded-lg") do
            span(class: "text-4xl font-semibold") { (i + 1).to_s }
          end
        end
      end
    end
  end
  render UI::Carousel::Previous.new
  render UI::Carousel::Next.new
end
```

### Sizes (Responsive Item Width)

```ruby
render UI::Carousel::Carousel.new do
  render UI::Carousel::Content.new do
    5.times do |i|
      render UI::Carousel::Item.new(classes: "md:basis-1/2 lg:basis-1/3") do
        div(class: "p-1") do
          div(class: "flex aspect-square items-center justify-center p-6 border rounded-lg") do
            span(class: "text-3xl font-semibold") { (i + 1).to_s }
          end
        end
      end
    end
  end
  render UI::Carousel::Previous.new
  render UI::Carousel::Next.new
end
```

### Spacing

```ruby
render UI::Carousel::Carousel.new(classes: "w-full max-w-sm") do
  render UI::Carousel::Content.new(classes: "-ml-1") do
    5.times do |i|
      render UI::Carousel::Item.new(classes: "pl-1") do
        div(class: "p-1") do
          div(class: "flex aspect-square items-center justify-center p-6 border rounded-lg") do
            span(class: "text-2xl font-semibold") { (i + 1).to_s }
          end
        end
      end
    end
  end
  render UI::Carousel::Previous.new
  render UI::Carousel::Next.new
end
```

### Orientation (Vertical)

```ruby
render UI::Carousel::Carousel.new(orientation: "vertical", classes: "w-full max-w-xs", opts: { align: "start" }) do
  render UI::Carousel::Content.new(classes: "-mt-1 h-[200px]") do
    5.times do |i|
      render UI::Carousel::Item.new(classes: "pt-1 md:basis-1/2") do
        div(class: "p-1") do
          div(class: "flex items-center justify-center p-6 border rounded-lg min-h-[120px]") do
            span(class: "text-3xl font-semibold") { (i + 1).to_s }
          end
        end
      end
    end
  end
  render UI::Carousel::Previous.new
  render UI::Carousel::Next.new
end
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

❌ **Wrong**: Using module instead of class
```ruby
render UI::Carousel  # This is the module, not a component
```

✅ **Correct**: Use the full class path
```ruby
render UI::Carousel::Carousel.new
```

❌ **Wrong**: Wrapping previous/next buttons in Content
```ruby
render UI::Carousel::Content.new do
  render UI::Carousel::Previous.new
  # ...
end
```

✅ **Correct**: Previous/Next are siblings of Content
```ruby
render UI::Carousel::Content.new do
  # ...
end
render UI::Carousel::Previous.new
render UI::Carousel::Next.new
```

❌ **Wrong**: Forgetting `.new`
```ruby
render UI::Carousel::Carousel do
  # ...
end
```

✅ **Correct**: Always call `.new`
```ruby
render UI::Carousel::Carousel.new do
  # ...
end
```
