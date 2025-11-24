# Slider Component - ViewComponent

Range slider with draggable thumbs, keyboard navigation, and ARIA support.

## Basic Usage

```erb
<%= render UI::Slider::SliderComponent.new(default_value: [50], max: 100, step: 1) do %>
  <%= render UI::Slider::SliderTrackComponent.new do %>
    <%= render UI::Slider::SliderRangeComponent.new %>
  <% end %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>
```

## Component Structure

The slider component consists of 4 nested components:

1. **SliderComponent** - Root container with range input behavior
2. **SliderTrackComponent** - Background rail for the slider
3. **SliderRangeComponent** - Filled portion showing selected value(s)
4. **SliderThumbComponent** - Draggable handle (can have multiple)

## Components

### SliderComponent (Root)

**Class**: `UI::Slider::SliderComponent`

**Parameters**:
- `min:` - Minimum value (default: `0`)
- `max:` - Maximum value (default: `100`)
- `step:` - Step increment (default: `1`)
- `value:` - Controlled value as array (e.g., `[50]` or `[25, 75]`)
- `default_value:` - Initial value as array (default: `[min]`)
- `disabled:` - Boolean - Whether slider is disabled
- `orientation:` - `"horizontal"` (default) or `"vertical"` - Slider orientation
- `inverted:` - Boolean - Invert slider direction
- `name:` - Form input name (String, for form submission)
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

### SliderTrackComponent

**Class**: `UI::Slider::SliderTrackComponent`

**Parameters**:
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

**Must contain**: `SliderRangeComponent`

### SliderRangeComponent

**Class**: `UI::Slider::SliderRangeComponent`

**Parameters**:
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

**Must be inside**: `SliderTrackComponent`

### SliderThumbComponent

**Class**: `UI::Slider::SliderThumbComponent`

**Parameters**:
- `disabled:` - Boolean - Whether thumb is disabled
- `classes:` - Additional CSS classes (String)
- `attributes:` - Additional HTML attributes (Hash)

**Note**: Render multiple thumbs for range selection

## Examples

### Single Value Slider

```erb
<div class="space-y-2">
  <label class="text-sm font-medium">Volume</label>
  <%= render UI::Slider::SliderComponent.new(default_value: [33], max: 100, step: 1) do %>
    <%= render UI::Slider::SliderTrackComponent.new do %>
      <%= render UI::Slider::SliderRangeComponent.new %>
    <% end %>
    <%= render UI::Slider::SliderThumbComponent.new %>
  <% end %>
</div>
```

### Range Slider (Two Thumbs)

```erb
<div class="space-y-2">
  <label class="text-sm font-medium">Price Range</label>
  <%= render UI::Slider::SliderComponent.new(default_value: [25, 75], max: 100) do %>
    <%= render UI::Slider::SliderTrackComponent.new do %>
      <%= render UI::Slider::SliderRangeComponent.new %>
    <% end %>
    <%= render UI::Slider::SliderThumbComponent.new %>
    <%= render UI::Slider::SliderThumbComponent.new %>
  <% end %>
</div>
```

### Custom Step Increments

```erb
<%# Step by 10 %>
<%= render UI::Slider::SliderComponent.new(default_value: [50], max: 100, step: 10) do %>
  <%= render UI::Slider::SliderTrackComponent.new do %>
    <%= render UI::Slider::SliderRangeComponent.new %>
  <% end %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>

<%# Step by 0.1 for decimal values %>
<%= render UI::Slider::SliderComponent.new(default_value: [2.5], min: 0, max: 5, step: 0.1) do %>
  <%= render UI::Slider::SliderTrackComponent.new do %>
    <%= render UI::Slider::SliderRangeComponent.new %>
  <% end %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>
```

### Custom Min/Max Range

```erb
<%# Range from 0 to 10 %>
<%= render UI::Slider::SliderComponent.new(default_value: [5], min: 0, max: 10) do %>
  <%= render UI::Slider::SliderTrackComponent.new do %>
    <%= render UI::Slider::SliderRangeComponent.new %>
  <% end %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>

<%# Range from -100 to 100 %>
<%= render UI::Slider::SliderComponent.new(default_value: [0], min: -100, max: 100) do %>
  <%= render UI::Slider::SliderTrackComponent.new do %>
    <%= render UI::Slider::SliderRangeComponent.new %>
  <% end %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>
```

### Disabled Slider

```erb
<%= render UI::Slider::SliderComponent.new(default_value: [50], disabled: true) do %>
  <%= render UI::Slider::SliderTrackComponent.new do %>
    <%= render UI::Slider::SliderRangeComponent.new %>
  <% end %>
  <%= render UI::Slider::SliderThumbComponent.new(disabled: true) %>
<% end %>
```

### Vertical Slider

```erb
<div class="h-64">
  <%= render UI::Slider::SliderComponent.new(default_value: [50], orientation: "vertical") do %>
    <%= render UI::Slider::SliderTrackComponent.new do %>
      <%= render UI::Slider::SliderRangeComponent.new %>
    <% end %>
    <%= render UI::Slider::SliderThumbComponent.new %>
  <% end %>
</div>
```

### Inverted Slider

```erb
<%# Left to right becomes right to left %>
<%= render UI::Slider::SliderComponent.new(default_value: [50], inverted: true) do %>
  <%= render UI::Slider::SliderTrackComponent.new do %>
    <%= render UI::Slider::SliderRangeComponent.new %>
  <% end %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>
```

### With Custom Width

```erb
<div class="w-[300px]">
  <%= render UI::Slider::SliderComponent.new(default_value: [50]) do %>
    <%= render UI::Slider::SliderTrackComponent.new do %>
      <%= render UI::Slider::SliderRangeComponent.new %>
    <% end %>
    <%= render UI::Slider::SliderThumbComponent.new %>
  <% end %>
</div>

<%# Or with classes parameter %>
<%= render UI::Slider::SliderComponent.new(default_value: [50], classes: "w-[60%]") do %>
  <%= render UI::Slider::SliderTrackComponent.new do %>
    <%= render UI::Slider::SliderRangeComponent.new %>
  <% end %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>
```

### Listening to Value Changes

```erb
<div data-controller="price-range">
  <div class="flex justify-between mb-2">
    <span>Min: $<span data-price-range-target="min">25</span></span>
    <span>Max: $<span data-price-range-target="max">75</span></span>
  </div>

  <%= render UI::Slider::SliderComponent.new(
    default_value: [25, 75],
    attributes: {
      data: {
        action: "slider:change->price-range#updateDisplay slider:commit->price-range#saveValue"
      }
    }
  ) do %>
    <%= render UI::Slider::SliderTrackComponent.new do %>
      <%= render UI::Slider::SliderRangeComponent.new %>
    <% end %>
    <%= render UI::Slider::SliderThumbComponent.new %>
    <%= render UI::Slider::SliderThumbComponent.new %>
  <% end %>
</div>

<%# Stimulus controller example:
// app/javascript/controllers/price_range_controller.js
export default class extends Controller {
  static targets = ["min", "max"]

  updateDisplay(event) {
    const [min, max] = event.detail.value
    this.minTarget.textContent = min
    this.maxTarget.textContent = max
  }

  saveValue(event) {
    // Called when dragging ends or keyboard navigation commits
    const [min, max] = event.detail.value
    // Save to server, localStorage, etc.
  }
}
%>
```

## Keyboard Navigation

### All Orientations
- **Tab** - Focus thumb
- **ArrowRight/ArrowUp** - Increase value by step
- **ArrowLeft/ArrowDown** - Decrease value by step
- **PageUp** - Increase by 10% of range
- **PageDown** - Decrease by 10% of range
- **Home** - Set to minimum value
- **End** - Set to maximum value

## Mouse/Touch Interaction

- **Click track** - Jump to clicked position (moves nearest thumb)
- **Drag thumb** - Smoothly adjust value
- **Hover thumb** - Show focus ring

## Events

The slider dispatches two custom events:

### `slider:change`

Fired continuously while dragging or using keyboard:

```javascript
element.addEventListener("slider:change", (event) => {
  console.log(event.detail.value) // e.g., [50] or [25, 75]
})
```

### `slider:commit`

Fired when interaction completes (mouseup, keyboard navigation):

```javascript
element.addEventListener("slider:commit", (event) => {
  console.log(event.detail.value) // Final value
  // Save to server, update form, etc.
})
```

## Important Notes

### Default Value Must Be Array

The `default_value` parameter **must always be an array**, even for single-thumb sliders:

```erb
<%# ✅ Correct - array with one value %>
<%= render UI::Slider::SliderComponent.new(default_value: [50]) do %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>

<%# ❌ Wrong - number instead of array %>
<%= render UI::Slider::SliderComponent.new(default_value: 50) do %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>

<%# ✅ Correct - array with two values for range %>
<%= render UI::Slider::SliderComponent.new(default_value: [25, 75]) do %>
  <%= render UI::Slider::SliderThumbComponent.new %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>
```

### Number of Thumbs Matches Array Length

The number of `SliderThumbComponent` instances should match the length of `default_value`:

```erb
<%# ✅ Correct - 1 thumb for 1 value %>
<%= render UI::Slider::SliderComponent.new(default_value: [50]) do %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>

<%# ✅ Correct - 2 thumbs for 2 values %>
<%= render UI::Slider::SliderComponent.new(default_value: [25, 75]) do %>
  <%= render UI::Slider::SliderThumbComponent.new %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>

<%# ❌ Wrong - 2 thumbs for 1 value %>
<%= render UI::Slider::SliderComponent.new(default_value: [50]) do %>
  <%= render UI::Slider::SliderThumbComponent.new %>
  <%= render UI::Slider::SliderThumbComponent.new %>  <%# Extra thumb! %>
<% end %>
```

### Range Must Be Inside Track

The `SliderRangeComponent` **must** be nested inside `SliderTrackComponent`:

```erb
<%# ✅ Correct - range inside track %>
<%= render UI::Slider::SliderTrackComponent.new do %>
  <%= render UI::Slider::SliderRangeComponent.new %>
<% end %>

<%# ❌ Wrong - range outside track %>
<%= render UI::Slider::SliderRangeComponent.new %>
<%= render UI::Slider::SliderTrackComponent.new %>
```

### Step Must Divide Range Evenly

For best UX, ensure `step` divides evenly into `max - min`:

```erb
<%# ✅ Good - 100 / 10 = 10 steps %>
<%= render UI::Slider::SliderComponent.new(min: 0, max: 100, step: 10) %>

<%# ✅ Good - 100 / 25 = 4 steps %>
<%= render UI::Slider::SliderComponent.new(min: 0, max: 100, step: 25) %>

<%# ⚠️ Works but awkward - 100 / 7 = 14.28... steps %>
<%= render UI::Slider::SliderComponent.new(min: 0, max: 100, step: 7) %>
```

## Accessibility

- Full ARIA support with `role="slider"`, `role="group"`
- Proper `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes
- Proper `aria-disabled` for disabled state
- Proper `aria-orientation` for vertical sliders
- Keyboard navigation following WAI-ARIA Slider pattern
- Focus visible ring on thumbs
- Touch-friendly 16px×16px thumb size

## Styling

The component uses shadcn/ui styling with Tailwind classes:
- Track: `bg-muted` background with rounded corners
- Range: `bg-primary` fill showing selected portion
- Thumb: White background with `border-primary` and `ring-ring/50` focus ring
- Disabled state: 50% opacity, no pointer events
- Smooth transitions on hover and focus

## Error Prevention

### ❌ Wrong: Using module name

```erb
<%= render UI::Slider.new %>  <%# UI::Slider is a module, not a component! %>
```

### ✅ Correct: Using full component class name

```erb
<%= render UI::Slider::SliderComponent.new %>
```

### ❌ Wrong: Number instead of array

```erb
<%= render UI::Slider::SliderComponent.new(default_value: 50) %>
```

### ✅ Correct: Array value

```erb
<%= render UI::Slider::SliderComponent.new(default_value: [50]) %>
```

### ❌ Wrong: Range outside track

```erb
<%= render UI::Slider::SliderRangeComponent.new %>
<%= render UI::Slider::SliderTrackComponent.new %>
```

### ✅ Correct: Range inside track

```erb
<%= render UI::Slider::SliderTrackComponent.new do %>
  <%= render UI::Slider::SliderRangeComponent.new %>
<% end %>
```

### ❌ Wrong: Thumb count mismatch

```erb
<%= render UI::Slider::SliderComponent.new(default_value: [50]) do %>
  <%= render UI::Slider::SliderThumbComponent.new %>
  <%= render UI::Slider::SliderThumbComponent.new %>  <%# Too many thumbs! %>
<% end %>
```

### ✅ Correct: Matching thumb count

```erb
<%= render UI::Slider::SliderComponent.new(default_value: [50]) do %>
  <%= render UI::Slider::SliderThumbComponent.new %>
<% end %>
```
