# Toggle Group Component - ERB

A set of two-state buttons that can be toggled on or off, supporting single and multiple selection modes.

## Basic Usage

```erb
<%= render "ui/toggle_group/toggle_group", type: "single" do %>
  <%= render "ui/toggle_group/item", value: "left" do %>Left<% end %>
  <%= render "ui/toggle_group/item", value: "center" do %>Center<% end %>
  <%= render "ui/toggle_group/item", value: "right" do %>Right<% end %>
<% end %>
```

## Component Paths

- **Group Partial**: `ui/toggle_group/toggle_group`
- **Item Partial**: `ui/toggle_group/item`
- **Files**:
  - `app/views/ui/toggle_group/_toggle_group.html.erb`
  - `app/views/ui/toggle_group/_item.html.erb`
- **Behavior Modules**:
  - `UI::ToggleGroupBehavior`
  - `UI::ToggleGroupItemBehavior`
- **Stimulus Controller**: `ui--toggle-group`

## Toggle Group Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | String | `"single"` | Selection mode: "single" or "multiple" |
| `variant` | String | `"default"` | Visual style variant (default, outline) |
| `size` | String | `"default"` | Size variant (default, sm, lg) |
| `value` | String/Array | `nil` | Current selected value(s) |
| `spacing` | Integer | `0` | Gap between items (0 means items touch) |
| `orientation` | String | `nil` | Layout direction (horizontal, vertical) |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Toggle Group Item Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | String | Required | Unique identifier for this item |
| `variant` | String | Inherited | Visual style (inherits from parent) |
| `size` | String | Inherited | Size (inherits from parent) |
| `pressed` | Boolean | `false` | Whether item is pressed/active |
| `disabled` | Boolean | `false` | Whether item is disabled |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

## Selection Modes

### Single Selection (Radio Group)
Only one item can be selected at a time.

```erb
<%= render "ui/toggle_group/toggle_group", type: "single", value: "center" do %>
  <%= render "ui/toggle_group/item", value: "left" do %>
    <%= lucide_icon("align-left") %>
  <% end %>
  <%= render "ui/toggle_group/item", value: "center" do %>
    <%= lucide_icon("align-center") %>
  <% end %>
  <%= render "ui/toggle_group/item", value: "right" do %>
    <%= lucide_icon("align-right") %>
  <% end %>
<% end %>
```

### Multiple Selection
Multiple items can be selected simultaneously.

```erb
<%= render "ui/toggle_group/toggle_group",
  type: "multiple",
  value: ["bold", "italic"] do %>
  <%= render "ui/toggle_group/item", value: "bold" do %>Bold<% end %>
  <%= render "ui/toggle_group/item", value: "italic" do %>Italic<% end %>
  <%= render "ui/toggle_group/item", value: "underline" do %>Underline<% end %>
<% end %>
```

## Variants

- `default` - Transparent background
- `outline` - Bordered variant with shadow (toolbar style)

```erb
<%= render "ui/toggle_group/toggle_group", variant: "outline" do %>
  <%= render "ui/toggle_group/item", value: "1" do %>Item 1<% end %>
  <%= render "ui/toggle_group/item", value: "2" do %>Item 2<% end %>
<% end %>
```

## Sizes

```erb
<!-- Small -->
<%= render "ui/toggle_group/toggle_group", size: "sm" do %>
  <%= render "ui/toggle_group/item", value: "a" do %>A<% end %>
<% end %>

<!-- Default -->
<%= render "ui/toggle_group/toggle_group", size: "default" do %>
  <%= render "ui/toggle_group/item", value: "a" do %>A<% end %>
<% end %>

<!-- Large -->
<%= render "ui/toggle_group/toggle_group", size: "lg" do %>
  <%= render "ui/toggle_group/item", value: "a" do %>A<% end %>
<% end %>
```

## With Spacing

When `spacing` is greater than 0, items will have a gap and rounded corners:

```erb
<%= render "ui/toggle_group/toggle_group", spacing: 2, variant: "outline" do %>
  <%= render "ui/toggle_group/item", value: "1" do %>One<% end %>
  <%= render "ui/toggle_group/item", value: "2" do %>Two<% end %>
  <%= render "ui/toggle_group/item", value: "3" do %>Three<% end %>
<% end %>
```

## Common Patterns

### Formatting Toolbar

```erb
<%= render "ui/toggle_group/toggle_group",
  type: "multiple",
  variant: "outline" do %>
  <%= render "ui/toggle_group/item", value: "bold" do %>
    <%= lucide_icon("bold") %>
  <% end %>
  <%= render "ui/toggle_group/item", value: "italic" do %>
    <%= lucide_icon("italic") %>
  <% end %>
  <%= render "ui/toggle_group/item", value: "underline" do %>
    <%= lucide_icon("underline") %>
  <% end %>
<% end %>
```

### Alignment Controls

```erb
<%= render "ui/toggle_group/toggle_group", type: "single" do %>
  <%= render "ui/toggle_group/item", value: "left" do %>
    <%= lucide_icon("align-left") %>
  <% end %>
  <%= render "ui/toggle_group/item", value: "center" do %>
    <%= lucide_icon("align-center") %>
  <% end %>
  <%= render "ui/toggle_group/item", value: "right" do %>
    <%= lucide_icon("align-right") %>
  <% end %>
  <%= render "ui/toggle_group/item", value: "justify" do %>
    <%= lucide_icon("align-justify") %>
  <% end %>
<% end %>
```

## Accessibility

The Toggle Group automatically handles ARIA attributes:

- **Single mode**: Uses `role="radiogroup"` with `role="radio"` and `aria-checked` for items
- **Multiple mode**: Uses `role="group"` with `role="button"` and `aria-pressed` for items
- Full keyboard navigation support (Arrow keys, Space, Enter)

## State Management

The Stimulus controller manages selection state automatically:

```erb
<!-- Controller listens for changes -->
<%= render "ui/toggle_group/toggle_group",
  type: "single",
  attributes: {
    "data-action": "ui--toggle-group:change->custom#handleChange"
  } do %>
  <%= render "ui/toggle_group/item", value: "1" do %>Option 1<% end %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Missing value attribute

```erb
<%= render "ui/toggle_group/item" do %>Text<% end %>  # Missing required value
```

### ✅ Correct: Always provide value

```erb
<%= render "ui/toggle_group/item", value: "unique-id" do %>Text<% end %>
```

### ❌ Wrong: Incorrect partial path

```erb
<%= render "ui/toggle_group" %>  # Missing _toggle_group
```

### ✅ Correct: Full partial path

```erb
<%= render "ui/toggle_group/toggle_group" do %>
  <%= render "ui/toggle_group/item", value: "1" do %>Item<% end %>
<% end %>
```
