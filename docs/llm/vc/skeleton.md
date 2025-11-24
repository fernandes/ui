# Skeleton Component - ViewComponent

Loading placeholder component with pulsing animation.

## Basic Usage

```ruby
<%= render UI::Skeleton::SkeletonComponent.new(class: "h-[20px] w-[100px] rounded-full") %>
```

## Component Path

- **Class**: `UI::Skeleton::SkeletonComponent`
- **File**: `app/components/ui/skeleton/skeleton_component.rb`
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

```ruby
<%= render UI::Skeleton::SkeletonComponent.new(class: "h-[20px] w-[100px] rounded-full") %>
```

### Card Skeleton

```ruby
<div class="flex flex-col space-y-3">
  <%= render UI::Skeleton::SkeletonComponent.new(class: "h-[125px] w-[250px] rounded-xl") %>
  <div class="space-y-2">
    <%= render UI::Skeleton::SkeletonComponent.new(class: "h-4 w-[250px]") %>
    <%= render UI::Skeleton::SkeletonComponent.new(class: "h-4 w-[200px]") %>
  </div>
</div>
```

### User Profile Skeleton

```ruby
<div class="flex items-center space-x-4">
  <%= render UI::Skeleton::SkeletonComponent.new(class: "h-12 w-12 rounded-full") %>
  <div class="space-y-2">
    <%= render UI::Skeleton::SkeletonComponent.new(class: "h-4 w-[250px]") %>
    <%= render UI::Skeleton::SkeletonComponent.new(class: "h-4 w-[200px]") %>
  </div>
</div>
```

### Table Skeleton

```ruby
<div class="space-y-2">
  <%= render UI::Skeleton::SkeletonComponent.new(class: "h-4 w-full") %>
  <%= render UI::Skeleton::SkeletonComponent.new(class: "h-4 w-full") %>
  <%= render UI::Skeleton::SkeletonComponent.new(class: "h-4 w-3/4") %>
</div>
```

## Common Patterns

### Rectangle Skeleton

Use arbitrary height/width values:
```ruby
<%= render UI::Skeleton::SkeletonComponent.new(class: "h-[200px] w-[400px]") %>
```

### Circle/Avatar Skeleton

Use equal width/height with `rounded-full`:
```ruby
<%= render UI::Skeleton::SkeletonComponent.new(class: "h-12 w-12 rounded-full") %>
```

### Text Line Skeleton

Use Tailwind height utilities:
```ruby
<%= render UI::Skeleton::SkeletonComponent.new(class: "h-4 w-[250px]") %>  # Single line
<%= render UI::Skeleton::SkeletonComponent.new(class: "h-3 w-[200px]") %>  # Smaller line
```

## Common Usage Errors

❌ **WRONG - Using module name**:
```ruby
<%= render UI::Skeleton.new(...) %>  # Wrong - this is the Phlex component
```

✅ **CORRECT - Full component class name**:
```ruby
<%= render UI::Skeleton::SkeletonComponent.new(class: "h-[20px] w-[100px]") %>
```

❌ **WRONG - Missing dimensions**:
```ruby
<%= render UI::Skeleton::SkeletonComponent.new %>  # Will have no visible size
```

✅ **CORRECT - Always specify dimensions**:
```ruby
<%= render UI::Skeleton::SkeletonComponent.new(class: "h-[20px] w-[100px]") %>
```

## Notes

- **CSS-only component**: No JavaScript behavior or Stimulus controller
- **Always specify dimensions**: Component has no default width/height
- **Use Tailwind utilities**: Customize size, shape, and spacing with utility classes
- **Animation**: Built-in `animate-pulse` provides 2s pulsing effect
- **Accessibility**: Uses `data-slot="skeleton"` for targeting in tests/styles
- **Class merging**: Uses `tailwind-merge` to intelligently merge classes (e.g., `rounded-full` overrides `rounded-md`)
- **Attribute merging**: Uses `deep_merge` for nested attributes like `data-*`
