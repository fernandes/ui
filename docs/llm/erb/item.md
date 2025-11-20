# Item Component - ERB

Flexible list item component with multiple sub-components for building complex list layouts.

## Basic Usage

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Item Title<% end %>
    <%= render "ui/item/description" do %>Item description<% end %>
  <% end %>
<% end %>
```

## Component Paths

### Main Partials

- **Item**: `ui/item/item` - Main container
- **Group**: `ui/item/group` - Groups multiple items
- **Media**: `ui/item/media` - Media content (icon, image)
- **Content**: `ui/item/content` - Text content wrapper
- **Title**: `ui/item/title` - Item title
- **Description**: `ui/item/description` - Item description
- **Actions**: `ui/item/actions` - Action buttons container
- **Header**: `ui/item/header` - Header section
- **Footer**: `ui/item/footer` - Footer section
- **Separator**: `ui/item/separator` - Visual separator

### Files

- **Partials**: `app/views/ui/item/_*.html.erb`
- **Behavior Modules**: `app/models/ui/item/*_behavior.rb`

## Item Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | String/Symbol | `"default"` | Visual style variant |
| `size` | String/Symbol | `"default"` | Size variant |
| `classes` | String | `""` | Additional CSS classes |

## Sub-component Parameters

All sub-components accept:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `classes` | String | `""` | Additional CSS classes |

## Variants

- `default` - Standard item with subtle background
- `outline` - Item with border
- `muted` - Item with muted background

## Sizes

- `default` - Standard padding (p-4 gap-4)
- `sm` - Compact padding (p-3 gap-3)

## Examples

### Basic Item

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Simple Item<% end %>
    <%= render "ui/item/description" do %>A basic list item<% end %>
  <% end %>
<% end %>
```

### Item with Media

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/media" do %>
    <div class="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
      <svg class="w-5 h-5"><!-- user icon --></svg>
    </div>
  <% end %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>John Doe<% end %>
    <%= render "ui/item/description" do %>john.doe@example.com<% end %>
  <% end %>
<% end %>
```

### Item with Actions

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Document.pdf<% end %>
    <%= render "ui/item/description" do %>Last modified 2 hours ago<% end %>
  <% end %>
  <%= render "ui/item/actions" do %>
    <%= render "ui/button", variant: :ghost, size: :sm, content: "Download" %>
    <%= render "ui/button", variant: :ghost, size: :sm, content: "Share" %>
  <% end %>
<% end %>
```

### With Variants

```erb
<%= render "ui/item/item", variant: "default" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Default Variant<% end %>
  <% end %>
<% end %>

<%= render "ui/item/item", variant: "outline" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Outline Variant<% end %>
  <% end %>
<% end %>

<%= render "ui/item/item", variant: "muted" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Muted Variant<% end %>
  <% end %>
<% end %>
```

### With Sizes

```erb
<%= render "ui/item/item", size: "sm" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Small Item<% end %>
  <% end %>
<% end %>

<%= render "ui/item/item", size: "default" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Default Item<% end %>
  <% end %>
<% end %>
```

### Item Group

```erb
<%= render "ui/item/group", classes: "space-y-2" do %>
  <%= render "ui/item/item", variant: "outline" do %>
    <%= render "ui/item/content" do %>
      <%= render "ui/item/title" do %>First Item<% end %>
    <% end %>
  <% end %>

  <%= render "ui/item/item", variant: "outline" do %>
    <%= render "ui/item/content" do %>
      <%= render "ui/item/title" do %>Second Item<% end %>
    <% end %>
  <% end %>
<% end %>
```

### With Separator

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>First Item<% end %>
  <% end %>
<% end %>

<%= render "ui/item/separator", classes: "my-2" %>

<%= render "ui/item/item" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Second Item<% end %>
  <% end %>
<% end %>
```

### With Header and Footer

```erb
<%= render "ui/item/item", variant: "outline", classes: "flex-col" do %>
  <%= render "ui/item/header", classes: "w-full pb-2 border-b" do %>
    <div class="font-semibold">Item Header</div>
  <% end %>

  <%= render "ui/item/content", classes: "w-full py-4" do %>
    <%= render "ui/item/title" do %>Main Content<% end %>
    <%= render "ui/item/description" do %>With header and footer<% end %>
  <% end %>

  <%= render "ui/item/footer", classes: "w-full pt-2 border-t text-sm text-muted-foreground" do %>
    Last updated: Today
  <% end %>
<% end %>
```

## Common Patterns

### User List Item

```erb
<%= render "ui/item/item", variant: "outline" do %>
  <%= render "ui/item/media" do %>
    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
      JD
    </div>
  <% end %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Jane Doe<% end %>
    <%= render "ui/item/description" do %>Product Designer • San Francisco, CA<% end %>
  <% end %>
  <%= render "ui/item/actions" do %>
    <%= render "ui/button", variant: :outline, size: :sm, content: "Follow" %>
  <% end %>
<% end %>
```

### Notification Item

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/media" do %>
    <div class="w-10 h-10 bg-green-500/10 rounded flex items-center justify-center">
      <svg class="w-5 h-5 text-green-500"><!-- check icon --></svg>
    </div>
  <% end %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Task Completed<% end %>
    <%= render "ui/item/description" do %>Your task was successfully completed<% end %>
  <% end %>
<% end %>
```

### File List Item

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/media" do %>
    <div class="w-10 h-10 bg-blue-500/10 rounded flex items-center justify-center">
      <svg class="w-5 h-5 text-blue-500"><!-- file icon --></svg>
    </div>
  <% end %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Report.xlsx<% end %>
    <%= render "ui/item/description" do %>Updated yesterday<% end %>
  <% end %>
  <%= render "ui/item/actions" do %>
    <%= render "ui/button", variant: :ghost, size: :icon do %>
      <svg class="w-4 h-4"><!-- more icon --></svg>
    <% end %>
  <% end %>
<% end %>
```

## Error Prevention

### ❌ Wrong: Using Phlex syntax

```erb
<%= render UI::Item::Item.new { "Text" } %>  # Wrong - this is Phlex
```

### ✅ Correct: Use string paths

```erb
<%= render "ui/item/item" do %>Content<% end %>  # Correct!
<%= render "ui/item/content" do %>Content<% end %>  # Correct!
<%= render "ui/item/title" do %>Title<% end %>  # Correct!
```

### ❌ Wrong: Standalone Title without Content wrapper

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/title" do %>Title<% end %>
<% end %>
# Works but loses Content wrapper styling
```

### ✅ Correct: Always wrap Title and Description in Content

```erb
<%= render "ui/item/item" do %>
  <%= render "ui/item/content" do %>
    <%= render "ui/item/title" do %>Title<% end %>
    <%= render "ui/item/description" do %>Description<% end %>
  <% end %>
<% end %>
```
