# Collapsible Component - ERB

An interactive component which expands/collapses a panel.

## Basic Usage

```erb
<%= render "ui/collapsible/collapsible" do %>
  <div class="flex items-center justify-between">
    <h4 class="text-sm font-semibold">Title</h4>
    <%= render "ui/collapsible/trigger" do %>
      <%= lucide_icon("chevrons-up-down") %>
    <% end %>
  </div>
  <%= render "ui/collapsible/content" do %>
    <p>Collapsible content here.</p>
  <% end %>
<% end %>
```

## Partial Paths

| Component | Partial Path |
|-----------|--------------|
| Collapsible | `ui/collapsible/collapsible` |
| Trigger | `ui/collapsible/trigger` |
| Content | `ui/collapsible/content` |

## Parameters

### Collapsible

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | Boolean | `false` | Initial open state |
| `disabled` | Boolean | `false` | Whether the collapsible is disabled |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Trigger

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Content

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `force_mount` | Boolean | `false` | Always render in DOM even when closed |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Examples

### Basic Collapsible

```erb
<%= render "ui/collapsible/collapsible", classes: "w-[350px] space-y-2" do %>
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
    <%= render "ui/collapsible/trigger" do %>
      <%= lucide_icon("chevrons-up-down", class: "h-4 w-4") %>
    <% end %>
  </div>
  <div class="rounded-md border px-4 py-3 font-mono text-sm">
    @radix-ui/primitives
  </div>
  <%= render "ui/collapsible/content", classes: "space-y-2" do %>
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
<%= render "ui/collapsible/collapsible", open: true, classes: "space-y-2" do %>
  <!-- trigger and content -->
<% end %>
```

### Multiple Independent Collapsibles

```erb
<div class="space-y-4">
  <%= render "ui/collapsible/collapsible", classes: "space-y-2" do %>
    <!-- Section 1 -->
  <% end %>
  <%= render "ui/collapsible/collapsible", classes: "space-y-2" do %>
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

### Wrong: Using Phlex component syntax

```erb
<%= render UI::Collapsible::Collapsible.new do %>
# This is Phlex syntax, not ERB partial syntax
```

### Correct: Use partial path

```erb
<%= render "ui/collapsible/collapsible" do %>
  <!-- content -->
<% end %>
```

### Wrong: Missing nested path

```erb
<%= render "ui/collapsible" do %>
# ERROR: Missing template
```

### Correct: Include subcomponent name

```erb
<%= render "ui/collapsible/collapsible" do %>
  <!-- content -->
<% end %>
```
