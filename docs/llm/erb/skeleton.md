# Skeleton Component - ERB

Loading placeholder component with pulsing animation.

## Basic Usage

```erb
<%= render "ui/skeleton/skeleton", class: "h-[20px] w-[100px] rounded-full" %>
```

## Component Path

- **Partial**: `app/views/ui/skeleton/_skeleton.html.erb`
- **Behavior Module**: None (CSS-only component)

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `class` | String | `""` | Additional CSS classes (width, height, shape) |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Default Classes

- `bg-accent` - Uses accent color for background
- `animate-pulse` - Pulsing animation (2s cubic-bezier)
- `rounded-md` - Medium border radius

## Examples

### Basic Skeleton

```erb
<%= render "ui/skeleton/skeleton", class: "h-[20px] w-[100px] rounded-full" %>
```

### Card Skeleton

```erb
<div class="flex flex-col space-y-3">
  <%= render "ui/skeleton/skeleton", class: "h-[125px] w-[250px] rounded-xl" %>
  <div class="space-y-2">
    <%= render "ui/skeleton/skeleton", class: "h-4 w-[250px]" %>
    <%= render "ui/skeleton/skeleton", class: "h-4 w-[200px]" %>
  </div>
</div>
```

### User Profile Skeleton

```erb
<div class="flex items-center space-x-4">
  <%= render "ui/skeleton/skeleton", class: "h-12 w-12 rounded-full" %>
  <div class="space-y-2">
    <%= render "ui/skeleton/skeleton", class: "h-4 w-[250px]" %>
    <%= render "ui/skeleton/skeleton", class: "h-4 w-[200px]" %>
  </div>
</div>
```

### Table Skeleton

```erb
<div class="space-y-2">
  <%= render "ui/skeleton/skeleton", class: "h-4 w-full" %>
  <%= render "ui/skeleton/skeleton", class: "h-4 w-full" %>
  <%= render "ui/skeleton/skeleton", class: "h-4 w-3/4" %>
</div>
```

## Common Patterns

### Rectangle Skeleton

Use arbitrary height/width values:
```erb
<%= render "ui/skeleton/skeleton", class: "h-[200px] w-[400px]" %>
```

### Circle/Avatar Skeleton

Use equal width/height with `rounded-full`:
```erb
<%= render "ui/skeleton/skeleton", class: "h-12 w-12 rounded-full" %>
```

### Text Line Skeleton

Use Tailwind height utilities:
```erb
<%= render "ui/skeleton/skeleton", class: "h-4 w-[250px]" %>  # Single line
<%= render "ui/skeleton/skeleton", class: "h-3 w-[200px]" %>  # Smaller line
```

## Common Usage Errors

❌ **WRONG - Incorrect partial path**:
```erb
<%= render "ui/skeleton" %>  # Missing /skeleton suffix
```

✅ **CORRECT - Full partial path**:
```erb
<%= render "ui/skeleton/skeleton", class: "h-[20px] w-[100px]" %>
```

❌ **WRONG - Missing dimensions**:
```erb
<%= render "ui/skeleton/skeleton" %>  # Will have no visible size
```

✅ **CORRECT - Always specify dimensions**:
```erb
<%= render "ui/skeleton/skeleton", class: "h-[20px] w-[100px]" %>
```

## Notes

- **CSS-only component**: No JavaScript behavior or Stimulus controller
- **Always specify dimensions**: Component has no default width/height
- **Use Tailwind utilities**: Customize size, shape, and spacing with utility classes
- **Animation**: Built-in `animate-pulse` provides 2s pulsing effect
- **Accessibility**: Uses `data-slot="skeleton"` for targeting in tests/styles
- **Simple class merging**: ERB partial uses string concatenation for class merging
