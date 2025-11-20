# Select Component - ERB

Custom select component with keyboard navigation, scrollable viewport, and form integration.

## Basic Usage

```erb
<%= render "ui/select/select", value: "apple" do %>
  <%= render "ui/select/select_trigger", placeholder: "Select a fruit..." %>
  <%= render "ui/select/select_content" do %>
    <%= render "ui/select/select_item", value: "apple" do %>Apple<% end %>
    <%= render "ui/select/select_item", value: "banana" do %>Banana<% end %>
  <% end %>
<% end %>
```

## Components

### Select (Root Container)

- **Partial**: `ui/select/select`
- **File**: `app/views/ui/select/_select.html.erb`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | String | `nil` | Currently selected value |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Trigger (Button)

- **Partial**: `ui/select/select_trigger`
- **Supports**: `as_child` composition

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Injects attributes into child element |
| `placeholder` | String | `"Select..."` | Placeholder text |
| `classes` | String | `""` | Additional CSS classes |
| `attributes` | Hash | `{}` | Additional HTML attributes |

### Content (Dropdown Container)

- **Partial**: `ui/select/select_content`

### Item (Option)

- **Partial**: `ui/select/select_item`
- **Supports**: `as_child` composition

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `as_child` | Boolean | `false` | Injects attributes into child element |
| `value` | String | `nil` | Value of this option |
| `disabled` | Boolean | `false` | Whether item is disabled |

### Group (Options Group)

- **Partial**: `ui/select/select_group`

### Label (Group Label)

- **Partial**: `ui/select/select_label`

## Examples

### Basic Select

```erb
<%= render "ui/select/select", value: "apple" do %>
  <%= render "ui/select/select_trigger", placeholder: "Select a fruit..." %>
  <%= render "ui/select/select_content" do %>
    <%= render "ui/select/select_item", value: "apple" do %>Apple<% end %>
    <%= render "ui/select/select_item", value: "banana" do %>Banana<% end %>
    <%= render "ui/select/select_item", value: "orange" do %>Orange<% end %>
  <% end %>
<% end %>
```

### With Grouped Options

```erb
<%= render "ui/select/select", value: "america/new_york" do %>
  <%= render "ui/select/select_trigger", placeholder: "Select timezone..." %>
  <%= render "ui/select/select_content" do %>
    <%= render "ui/select/select_group" do %>
      <%= render "ui/select/select_label" do %>North America<% end %>
      <%= render "ui/select/select_item", value: "america/new_york" do %>Eastern Time (ET)<% end %>
      <%= render "ui/select/select_item", value: "america/chicago" do %>Central Time (CT)<% end %>
    <% end %>

    <%= render "ui/select/select_group" do %>
      <%= render "ui/select/select_label" do %>Europe<% end %>
      <%= render "ui/select/select_item", value: "europe/london" do %>London (GMT)<% end %>
      <%= render "ui/select/select_item", value: "europe/paris" do %>Paris (CET)<% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Disabled Items

```erb
<%= render "ui/select/select", value: "react" do %>
  <%= render "ui/select/select_trigger", placeholder: "Select framework..." %>
  <%= render "ui/select/select_content" do %>
    <%= render "ui/select/select_item", value: "react" do %>React<% end %>
    <%= render "ui/select/select_item", value: "vue" do %>Vue<% end %>
    <%= render "ui/select/select_item", value: "angular", disabled: true do %>Angular (Coming Soon)<% end %>
  <% end %>
<% end %>
```

### With asChild - Custom Trigger

```erb
<%= render "ui/select/select", value: "pro" do %>
  <%= render "ui/select/select_trigger", as_child: true, placeholder: "Select plan..." do %>
    <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground">
      <span data-ui--select-target="valueDisplay">Select plan...</span>
    </button>
  <% end %>

  <%= render "ui/select/select_content" do %>
    <%= render "ui/select/select_item", value: "free" do %>Free - $0/mo<% end %>
    <%= render "ui/select/select_item", value: "pro" do %>Pro - $10/mo<% end %>
  <% end %>
<% end %>
```

## Keyboard Navigation

- **↓ / ↑** - Navigate through items
- **Home / End** - Jump to first/last item
- **Enter / Space** - Select focused item
- **Esc** - Close dropdown

## Error Prevention

### ❌ Wrong: Items directly in Select

```erb
<%= render "ui/select/select" do %>
  <%= render "ui/select/select_item", value: "apple" do %>Apple<% end %>
<% end %>
```

### ✅ Correct: Must have Trigger and Content

```erb
<%= render "ui/select/select" do %>
  <%= render "ui/select/select_trigger", placeholder: "Select..." %>
  <%= render "ui/select/select_content" do %>
    <%= render "ui/select/select_item", value: "apple" do %>Apple<% end %>
  <% end %>
<% end %>
```
