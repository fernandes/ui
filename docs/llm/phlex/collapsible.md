# Collapsible Component - Phlex

An interactive component which expands/collapses a panel.

## Basic Usage

```ruby
<%= render UI::Collapsible::Collapsible.new do %>
  <div class="flex items-center justify-between">
    <h4 class="text-sm font-semibold">Title</h4>
    <%= render UI::Collapsible::Trigger.new(as_child: true) do |trigger_attrs| %>
      <%= render UI::Button::Button.new(**trigger_attrs, variant: :ghost, size: :sm) do %>
        <%= lucide_icon("chevrons-up-down") %>
      <% end %>
    <% end %>
  </div>
  <%= render UI::Collapsible::Content.new do %>
    <p>Collapsible content here.</p>
  <% end %>
<% end %>
```

## Component Paths

| Component | Class | File |
|-----------|-------|------|
| Collapsible | `UI::Collapsible::Collapsible` | `app/components/ui/collapsible/collapsible.rb` |
| Trigger | `UI::Collapsible::Trigger` | `app/components/ui/collapsible/trigger.rb` |
| Content | `UI::Collapsible::Content` | `app/components/ui/collapsible/content.rb` |

## Parameters

### Collapsible

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | Boolean | `false` | Initial open state |
| `disabled` | Boolean | `false` | Whether the collapsible is disabled |
| `as_child` | Boolean | `false` | Yield attributes to child instead of rendering wrapper |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### Trigger

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Yield attributes to child instead of rendering button |
| `open` | Boolean | `false` | Pass the root's `open` so the server renders `aria-expanded` right (ERB does this automatically) |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### Content

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `force_mount` | Boolean | `false` | Always render in DOM even when closed |
| `open` | Boolean | `false` | Pass the root's `open` so the content is rendered open (ERB does this automatically) |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Collapsible

```ruby
<%= render UI::Collapsible::Collapsible.new(classes: "w-[350px] space-y-2") do %>
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
    <%= render UI::Collapsible::Trigger.new(as_child: true) do |trigger_attrs| %>
      <%= render UI::Button::Button.new(**trigger_attrs, variant: :ghost, size: :sm, classes: "w-9 p-0") do %>
        <%= lucide_icon("chevrons-up-down", class: "h-4 w-4") %>
      <% end %>
    <% end %>
  </div>
  <div class="rounded-md border px-4 py-3 font-mono text-sm">
    @radix-ui/primitives
  </div>
  <%= render UI::Collapsible::Content.new(classes: "space-y-2") do %>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">
      @radix-ui/colors
    </div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">
      @stitches/react
    </div>
  <% end %>
<% end %>
```

### Initially Open

```ruby
<%= render UI::Collapsible::Collapsible.new(open: true, classes: "space-y-2") do %>
  <!-- trigger and content -->
<% end %>
```

### With asChild Pattern

The `as_child` parameter yields HTML attributes to the child component instead of rendering a wrapper element. This is essential for composing with Button components:

```ruby
<%= render UI::Collapsible::Trigger.new(as_child: true) do |trigger_attrs| %>
  <%= render UI::Button::Button.new(**trigger_attrs, variant: :outline) do %>
    Toggle
  <% end %>
<% end %>
```

### Multiple Independent Collapsibles

```ruby
<div class="space-y-4">
  <%= render UI::Collapsible::Collapsible.new(classes: "space-y-2") do %>
    <!-- Section 1 -->
  <% end %>
  <%= render UI::Collapsible::Collapsible.new(classes: "space-y-2") do %>
    <!-- Section 2 -->
  <% end %>
</div>
```

## Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-state` | `"open"` / `"closed"` | Current state of the collapsible |
| `data-slot` | `"collapsible"` / `"collapsible-trigger"` / `"collapsible-content"` | Component identification |

## Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Space` | Opens/closes the collapsible |
| `Enter` | Opens/closes the collapsible |

## Error Prevention

### Wrong: Missing asChild for Button trigger

```ruby
<%= render UI::Collapsible::Trigger.new do %>
  <%= render UI::Button::Button.new { "Toggle" } %>
<% end %>
# Creates nested buttons (invalid HTML)
```

### Correct: Use asChild to merge attributes

```ruby
<%= render UI::Collapsible::Trigger.new(as_child: true) do |trigger_attrs| %>
  <%= render UI::Button::Button.new(**trigger_attrs) { "Toggle" } %>
<% end %>
```

### Wrong: Using module directly

```ruby
<%= render UI::Collapsible.new do %>
# ERROR: undefined method 'new' for module UI::Collapsible
```

### Correct: Use full component path

```ruby
<%= render UI::Collapsible::Collapsible.new do %>
```

## Accessibility

- The trigger renders `aria-expanded`; the controller gives the content a per-instance id and points the trigger's `aria-controls` at it (an `id` you pass is kept).
- `disabled: true` on the root disables the trigger (`aria-disabled` for a non-button `as_child` trigger) and adds `data-disabled` to every part.
- Closed content always gets `hidden`, so it is not tabbable, even when no transition runs.
