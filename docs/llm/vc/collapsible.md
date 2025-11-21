# Collapsible Component - ViewComponent

An interactive component which expands/collapses a panel.

## Basic Usage

```erb
<%= render(UI::Collapsible::CollapsibleComponent.new) do %>
  <div class="flex items-center justify-between">
    <h4 class="text-sm font-semibold">Title</h4>
    <%= render(UI::Button::ButtonComponent.new(variant: :ghost, size: :sm, data: { slot: "collapsible-trigger", "ui--collapsible-target": "trigger", action: "click->ui--collapsible#toggle" })) do %>
      <%= lucide_icon("chevrons-up-down") %>
    <% end %>
  </div>
  <%= render(UI::Collapsible::ContentComponent.new) do %>
    <p>Collapsible content here.</p>
  <% end %>
<% end %>
```

## Component Paths

| Component | Class | File |
|-----------|-------|------|
| Collapsible | `UI::Collapsible::CollapsibleComponent` | `app/components/ui/collapsible/collapsible_component.rb` |
| Trigger | `UI::Collapsible::TriggerComponent` | `app/components/ui/collapsible/trigger_component.rb` |
| Content | `UI::Collapsible::ContentComponent` | `app/components/ui/collapsible/content_component.rb` |

## Parameters

### CollapsibleComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | Boolean | `false` | Initial open state |
| `disabled` | Boolean | `false` | Whether the collapsible is disabled |
| `as_child` | Boolean | `false` | Yield attributes to child instead of rendering wrapper |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### TriggerComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Yield attributes to child instead of rendering button |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

### ContentComponent

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `force_mount` | Boolean | `false` | Always render in DOM even when closed |
| `classes` | String | `""` | Additional CSS classes |
| `**attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Collapsible

```erb
<%= render(UI::Collapsible::CollapsibleComponent.new(classes: "w-[350px] space-y-2")) do %>
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
    <%= render(UI::Button::ButtonComponent.new(variant: :ghost, size: :sm, classes: "w-9 p-0", data: { slot: "collapsible-trigger", "ui--collapsible-target": "trigger", action: "click->ui--collapsible#toggle" })) do %>
      <%= lucide_icon("chevrons-up-down", class: "h-4 w-4") %>
    <% end %>
  </div>
  <div class="rounded-md border px-4 py-3 font-mono text-sm">
    @radix-ui/primitives
  </div>
  <%= render(UI::Collapsible::ContentComponent.new(classes: "space-y-2")) do %>
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

```erb
<%= render(UI::Collapsible::CollapsibleComponent.new(open: true, classes: "space-y-2")) do %>
  <!-- trigger and content -->
<% end %>
```

### Note on Trigger with ViewComponent

With ViewComponent, the Trigger doesn't support `as_child` pattern directly. Instead, add the trigger data attributes manually to your Button:

```erb
<%= render(UI::Button::ButtonComponent.new(
  variant: :ghost,
  size: :sm,
  data: {
    slot: "collapsible-trigger",
    "ui--collapsible-target": "trigger",
    action: "click->ui--collapsible#toggle"
  }
)) do %>
  <%= lucide_icon("chevrons-up-down") %>
<% end %>
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

### Wrong: Missing Component suffix

```erb
<%= render(UI::Collapsible::Collapsible.new) do %>
# This is Phlex syntax, ViewComponent uses CollapsibleComponent
```

### Correct: Use Component suffix

```erb
<%= render(UI::Collapsible::CollapsibleComponent.new) do %>
  <!-- content -->
<% end %>
```

### Wrong: Missing parentheses for blocks

```erb
<%= render UI::Collapsible::CollapsibleComponent.new do %>
# Block may not be passed correctly without parentheses
```

### Correct: Use parentheses

```erb
<%= render(UI::Collapsible::CollapsibleComponent.new) do %>
  <!-- content -->
<% end %>
```
